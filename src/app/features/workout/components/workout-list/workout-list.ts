import { Component, inject } from '@angular/core';
import { WorkoutPlayerService } from '../../../../core/services/workout-player.service';
import { MockService } from '../../../../core/services/mock.service';

@Component({
  selector: 'app-workout-list',
  imports: [],
  templateUrl: './workout-list.html',
  styleUrl: './workout-list.css',
})
export class WorkoutList {
  workoutPlayerService = inject(WorkoutPlayerService);
  readonly mockService = inject(MockService);
  startWorkout() {
    const workout = {
      id: '1',
      name: 'Test Workout',
      description: 'This is a test workout',
      tags: ['test', 'workout'],
      blocks: []
    };
    this.workoutPlayerService.playWorkout(workout);
    // go to active workout page.
  }
}
