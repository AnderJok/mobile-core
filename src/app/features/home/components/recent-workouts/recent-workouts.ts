import { Component, inject } from '@angular/core';
import { WorkoutPlayerService } from '../../../../core/services/workout-player.service';
import { MockService } from '../../../../core/services/mock.service';
import { Workout } from '../../../../shared/interfaces/workout';

@Component({
  selector: 'app-recent-workouts',
  imports: [],
  templateUrl: './recent-workouts.html',
  styleUrl: './recent-workouts.css',
})
export class RecentWorkouts {
  workoutPlayerService = inject(WorkoutPlayerService);
  mockService = inject(MockService);

  startWorkout(workout: Workout) {
    this.workoutPlayerService.playWorkout(workout);
  }
}
