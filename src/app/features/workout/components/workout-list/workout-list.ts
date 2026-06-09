import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WorkoutPlayerService } from '../../../../core/services/workout-player.service';
import { MockService } from '../../../../core/services/mock.service';
import { Workout } from '../../../../shared/interfaces/workout';

@Component({
  selector: 'app-workout-list',
  imports: [RouterLink],
  templateUrl: './workout-list.html',
  styleUrl: './workout-list.css',
})
export class WorkoutList {
  workoutPlayerService = inject(WorkoutPlayerService);
  readonly mockService = inject(MockService);

  startWorkout(workout: Workout) {
    this.workoutPlayerService.playWorkout(workout);
  }
}
