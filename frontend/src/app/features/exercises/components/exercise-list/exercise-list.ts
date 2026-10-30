import { Component, DestroyRef, EventEmitter, inject, Output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExerciseService } from '../../../../services/exercise.service';
import type { Exercise } from '../../../../shared/interfaces/exercise';

@Component({
  selector: 'app-exercise-list',
  imports: [],
  templateUrl: './exercise-list.html',
  styleUrl: './exercise-list.css',
})
export class ExerciseList {
  readonly exerciseService = inject(ExerciseService);
  private readonly destroyRef = inject(DestroyRef);
  readonly pendingDelete = signal<string | null>(null);
  readonly deleting = signal<string | null>(null);
  readonly error = signal('');
  @Output() readonly editRequested = new EventEmitter<Exercise>();

  deleteExercise(exercise: Exercise) {
    if (!exercise?.id || this.deleting()) {
      return;
    }
    this.error.set('');
    this.deleting.set(exercise.id);
    this.exerciseService.deleteExerciseById(exercise.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.pendingDelete.set(null);
        this.deleting.set(null);
      },
      error: error => {
        console.error('Failed to delete exercise:', error);
        this.error.set('Could not delete the exercise. Please retry.');
        this.deleting.set(null);
      },
    });
  }

  editExercise(exercise: Exercise) {
    this.editRequested.emit(exercise);
  }
}
