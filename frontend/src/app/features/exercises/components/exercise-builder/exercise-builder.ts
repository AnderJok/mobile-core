import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExerciseService } from '../../../../services/exercise.service';
import { Exercise } from '../../../../shared/interfaces/exercise';
import { ExerciseType } from '../../../../shared/interfaces/exercise-type';

@Component({
  selector: 'app-exercise-builder',
  imports: [ReactiveFormsModule],
  templateUrl: './exercise-builder.html',
  styleUrl: './exercise-builder.css',
})
export class ExerciseBuilder {
  private readonly formBuilder = inject(FormBuilder);
  readonly exerciseService = inject(ExerciseService);

  readonly ExerciseType = ExerciseType;
  @Output() readonly finished = new EventEmitter<void>();

  selectedExercise: Exercise | null = null;

  @Input()
  set exercise(exercise: Exercise | null) {
    this.selectedExercise = exercise;
    if (exercise) {
      this.exerciseForm.patchValue({
        name: exercise.name,
        hasVariations: exercise.hasVariations,
        type: exercise.type,
        defaultValue: exercise.defaultValue ?? null,
        description: exercise.description,
        tags: exercise.tags.join(', '),
      });
    } else {
      this.resetForm();
    }
  }

  readonly exerciseForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    hasVariations: [false],
    type: [ExerciseType.REPS, [Validators.required]],
    defaultValue: [null as number | null],
    description: [''],
    tags: [''],
  });

  saveExercise() {
    if (this.exerciseForm.invalid) {
      this.exerciseForm.markAllAsTouched();
      return;
    }

    const formValues = this.exerciseForm.getRawValue();
    const trimmedName = formValues.name?.trim();

    if (!trimmedName) {
      return;
    }

    const tags = formValues.tags
      ? formValues.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    const exercise: Exercise = {
      id: this.selectedExercise?.id,
      name: trimmedName,
      description: formValues.description?.trim() ?? '',
      type: formValues.type ?? ExerciseType.REPS,
      hasVariations: !!formValues.hasVariations,
      defaultValue:
        formValues.defaultValue !== null &&
        formValues.defaultValue !== undefined &&
        !isNaN(Number(formValues.defaultValue))
          ? Number(formValues.defaultValue)
          : undefined,
      tags
    };

    const request = this.selectedExercise?.id
      ? this.exerciseService.updateExercise(this.selectedExercise.id, exercise)
      : this.exerciseService.createExercise(exercise);

    request.subscribe({
      next: () => {
        this.selectedExercise = null;
        this.resetForm();
        this.finished.emit();
      },
      error: (err) => {
        console.error('Failed to save exercise:', err);
      },
    });
  }

  cancelEditing() {
    this.selectedExercise = null;
    this.resetForm();
    this.finished.emit();
  }

  private resetForm() {
    this.exerciseForm.reset({
      name: '',
      hasVariations: false,
      type: ExerciseType.REPS,
      defaultValue: null,
      description: '',
      tags: '',
    });
  }
}
