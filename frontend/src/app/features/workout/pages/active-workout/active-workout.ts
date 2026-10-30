import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { WorkoutPlayerService } from '../../../../core/services/workout-player.service';

@Component({
  selector: 'app-active-workout',
  imports: [],
  templateUrl: './active-workout.html',
  styleUrl: './active-workout.css',
})
export class ActiveWorkout {
  workoutPlayerService = inject(WorkoutPlayerService);
  private readonly router = inject(Router);

  nextStep() {
    this.workoutPlayerService.nextStep();
    if (!this.workoutPlayerService.activeWorkout()) {
      this.router.navigate(['/home']);
    }
  }
}
