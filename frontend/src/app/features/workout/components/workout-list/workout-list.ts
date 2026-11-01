import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { WorkoutPlayerService } from '../../../../core/services/workout-player.service';
import { Workout } from '../../../../shared/interfaces/workout';
import { WorkoutService } from '../../../../services/workout.service';

@Component({
  selector: 'app-workout-list',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  standalone: true,
  templateUrl: './workout-list.html',
  styleUrl: './workout-list.css',
})
export class WorkoutList {
  workoutPlayerService = inject(WorkoutPlayerService);
  readonly workoutService = inject(WorkoutService);
  private readonly destroyRef = inject(DestroyRef);
  readonly pendingDelete = signal<string | null>(null);
  readonly deleting = signal<string | null>(null);
  readonly error = signal('');

  deleteWorkout(workout: Workout) {
    if (this.deleting()) {
      return;
    }
    this.error.set('');
    this.deleting.set(workout.id);
    this.workoutService.deleteWorkoutById(workout.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.pendingDelete.set(null);
        this.deleting.set(null);
      },
      error: error => {
        console.error('Failed to delete workout:', error);
        this.error.set('Could not delete the workout. Please retry.');
        this.deleting.set(null);
      },
    });
  }

  startWorkout(workout: Workout) {
    this.workoutPlayerService.playWorkout(workout);
  }
}
