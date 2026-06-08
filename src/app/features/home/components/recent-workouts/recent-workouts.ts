import { Component, inject } from '@angular/core';
import { WorkoutPlayerService } from '../../../../core/services/workout-player.service';

@Component({
  selector: 'app-recent-workouts',
  imports: [],
  templateUrl: './recent-workouts.html',
  styleUrl: './recent-workouts.css',
})
export class RecentWorkouts {
  workoutPlayerService = inject(WorkoutPlayerService);

  startWorkout() {
    const workout = {
      id: '1',
      name: 'Test Workout',
      description: 'This is a test workout',
      tags: ['test', 'workout'],
      blocks: []
    };
    this.workoutPlayerService.playWorkout(workout);
  }
}
