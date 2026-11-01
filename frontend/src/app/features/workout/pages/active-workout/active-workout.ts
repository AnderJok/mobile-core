import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WorkoutPlayerService } from '../../../../core/services/workout-player.service';

@Component({
  selector: 'app-active-workout',
  imports: [MatButtonModule, MatIconModule],
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

  previousStep() {
    this.workoutPlayerService.previousStep();
    if (!this.workoutPlayerService.activeWorkout()) {
      this.router.navigate(['/home']);
    }
  }
}
