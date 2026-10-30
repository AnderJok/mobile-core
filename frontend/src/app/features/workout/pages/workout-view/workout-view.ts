import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WorkoutService } from '../../../../services/workout.service';
import { Workout } from '../../../../shared/interfaces/workout';

@Component({
  selector: 'app-workout-view',
  imports: [RouterLink],
  templateUrl: './workout-view.html',
  styleUrl: './workout-view.css',
})
export class WorkoutView {
  private readonly service = inject(WorkoutService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id');
  readonly workout = signal<Workout | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');

  constructor() {
    this.loadWorkout();
  }

  loadWorkout() {
    if (!this.id) {
      this.error.set('Workout id is required.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.service.getWorkoutById(this.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: workout => {
        this.workout.set(workout);
        this.loading.set(false);
      },
      error: error => {
        console.error('Failed to load workout:', error);
        this.error.set('Could not load this workout. It may have been deleted.');
        this.loading.set(false);
      },
    });
  }
}
