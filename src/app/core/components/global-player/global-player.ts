import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { WorkoutPlayerService } from '../../services/workout-player.service';

@Component({
  selector: 'app-global-player',
  imports: [],
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
}
