import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ExerciseService } from '../../../../services/exercise.service';
import { WorkoutService } from '../../../../services/workout.service';
import { Workout, WorkoutInput } from '../../../../shared/interfaces/workout';
import { WorkoutBlock } from '../../../../shared/interfaces/workout-block';
import { ExerciseInstance } from '../../../../shared/interfaces/exercise-instance';
import { Exercise } from '../../../../shared/interfaces/exercise';
import { WorkoutTag } from '../../../../shared/interfaces/workout-tag';
import { ExerciseType } from '../../../../shared/interfaces/exercise-type';

@Component({
  selector: 'app-workout-builder',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './workout-builder.html',
  styleUrl: './workout-builder.css',
})
export class WorkoutBuilder {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(WorkoutService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly exerciseService = inject(ExerciseService);
  readonly workoutId = inject(ActivatedRoute).snapshot.paramMap.get('id');
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly tagsError = signal('');
  readonly availableTags = signal<WorkoutTag[]>([]);
  readonly archivedExercises = signal<Exercise[]>([]);
  readonly exercises = computed(() => {
    const active = this.exerciseService.exercises();
    return [...new Map([...this.archivedExercises(), ...active].map(exercise => [exercise.id, exercise])).values()];
  });
  readonly newTag = this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(255)]);
  readonly creatingTag = signal(false);
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(255)]],
    description: ['', Validators.maxLength(255)],
    tags: this.fb.nonNullable.control<WorkoutTag[]>([]),
    blocks: this.fb.array([this.createBlock()], Validators.required),
  });

  constructor() {
    this.loadTags();
    if (this.workoutId) {
      this.loadWorkout();
    }
  }

  get blocks() {
    return this.form.controls.blocks;
  }

  loadWorkout() {
    if (!this.workoutId) {
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.service.getWorkoutById(this.workoutId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: workout => {
        this.fillForm(workout);
        this.loading.set(false);
      },
      error: error => {
        console.error('Failed to load workout:', error);
        this.error.set('Could not load this workout. It may have been deleted.');
        this.loading.set(false);
        this.form.disable();
      },
    });
  }

  loadTags() {
    this.tagsError.set('');
    this.service.getTags().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: tags => this.availableTags.set(tags),
      error: error => {
        console.error('Failed to load workout tags:', error);
        this.tagsError.set('Could not load workout tags. Please retry.');
      },
    });
  }

  createTag() {
    this.newTag.markAsTouched();
    if (this.newTag.invalid || this.creatingTag()) {
      return;
    }
    this.creatingTag.set(true);
    this.tagsError.set('');
    this.service.createTag(this.newTag.value.trim()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: tag => {
        this.availableTags.update(tags => tags.some(current => current.id === tag.id) ? tags : [...tags, tag]);
        if (!this.form.controls.tags.value.some(current => current.id === tag.id)) {
          this.form.controls.tags.setValue([...this.form.controls.tags.value, tag]);
        }
        this.newTag.reset();
        this.creatingTag.set(false);
      },
      error: error => {
        console.error('Failed to create workout tag:', error);
        this.tagsError.set('Could not create the tag. Please retry.');
        this.creatingTag.set(false);
      },
    });
  }

  readonly compareTags = (first: WorkoutTag, second: WorkoutTag) => first?.id === second?.id;

  addBlock() {
    this.blocks.push(this.createBlock());
  }

  addExercise(blockIndex: number) {
    this.blocks.at(blockIndex).controls.exercises.push(this.createInstance());
  }

  move<T extends AbstractControl>(array: FormArray<T>, control: T, direction: number) {
    const index = array.controls.indexOf(control);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= array.length) {
      return;
    }
    array.removeAt(index);
    array.insert(target, control);
    array.markAsDirty();
  }

  selectExercise(blockIndex: number, exerciseIndex: number) {
    const instance = this.blocks.at(blockIndex).controls.exercises.at(exerciseIndex);
    const exercise = this.exercises().find(item => item.id === instance.controls.exerciseId.value);
    instance.controls.targetValue.setValue(exercise?.defaultValue ?? 10);
  }

  unit(exerciseId: string) {
    return this.exercises().find(item => item.id === exerciseId)?.type === ExerciseType.TIME ? 'seconds' : 'reps';
  }

  saveWorkout() {
    if (this.saving() || this.loading() || this.form.disabled) {
      return;
    }
    this.error.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Check the form: enter a name, at least one block and exercise, and valid numeric values.');
      return;
    }
    const value = this.form.getRawValue();
    const workout: WorkoutInput = {
      name: value.name.trim(),
      description: value.description.trim(),
      tags: value.tags,
      blocks: value.blocks.map(block => ({
        ...block,
        exercises: block.exercises.map(instance => ({
          exercise: { id: instance.exerciseId },
          targetValue: instance.targetValue,
          weight: instance.weight,
        })),
      })),
    };
    this.saving.set(true);
    this.form.disable();
    const request = this.workoutId
      ? this.service.updateWorkout(this.workoutId, workout)
      : this.service.createWorkout(workout);
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/workouts']);
      },
      error: error => {
        console.error('Failed to save workout:', error);
        this.error.set('Could not save the workout. Check your connection and that the exercises and tags still exist.');
        this.saving.set(false);
        this.form.enable();
      },
    });
  }

  private integer(min: number) {
    return [Validators.required, Validators.min(min), Validators.max(2147483647), Validators.pattern(/^\d+$/)];
  }

  private createInstance(instance?: ExerciseInstance) {
    return this.fb.group({
      exerciseId: this.fb.nonNullable.control(instance?.exercise.id ?? '', Validators.required),
      targetValue: this.fb.nonNullable.control(instance?.targetValue ?? 10, this.integer(1)),
      weight: this.fb.control<number | null>(instance?.weight ?? null, Validators.min(0)),
    });
  }

  private createBlock(block?: WorkoutBlock) {
    return this.fb.group({
      rounds: this.fb.nonNullable.control(block?.rounds ?? 1, this.integer(1)),
      restBetweenRounds: this.fb.nonNullable.control(block?.restBetweenRounds ?? 0, this.integer(0)),
      restBetweenExercises: this.fb.nonNullable.control(block?.restBetweenExercises ?? 0, this.integer(0)),
      restAfterBlock: this.fb.nonNullable.control(block?.restAfterBlock ?? 0, this.integer(0)),
      exercises: this.fb.array(block ? block.exercises.map(instance => this.createInstance(instance)) : [this.createInstance()], Validators.required),
    });
  }

  private fillForm(workout: Workout) {
    this.form.enable();
    this.archivedExercises.set(workout.blocks.flatMap(block => block.exercises.map(instance => instance.exercise)));
    this.form.patchValue({ name: workout.name, description: workout.description ?? '', tags: workout.tags });
    this.blocks.clear();
    workout.blocks.forEach(block => this.blocks.push(this.createBlock(block)));
  }
}
