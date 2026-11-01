import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WorkoutPlayerService } from '../../services/workout-player.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-global-player',
  imports: [MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './global-player.html',
  styleUrl: './global-player.css',
})
export class GlobalPlayer {
  workoutPlayerService = inject(WorkoutPlayerService);
  private readonly router = inject(Router);

  goToWorkout() {
    const activeWorkout = this.workoutPlayerService.activeWorkout();
    if (activeWorkout) {
      this.router.navigate(['/active-workout', activeWorkout.id]);
    }
  }

  stopWorkout() {
    this.workoutPlayerService.stopWorkout();
    this.router.navigate(['/home']);
  }

  nextStep() {
    this.workoutPlayerService.nextStep();
    if (!this.workoutPlayerService.activeWorkout()) {
      this.router.navigate(['/home']);
    }
  }

  previousStep() {
    this.workoutPlayerService.previousStep();
  }
}
