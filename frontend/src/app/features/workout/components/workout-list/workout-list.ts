import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WorkoutPlayerService } from '../../../../core/services/workout-player.service';
import { MockService } from '../../../../core/services/mock.service';
import { Workout } from '../../../../shared/interfaces/workout';
import { WorkoutService } from '../../../../services/workout.service';

@Component({
  selector: 'app-workout-list',
  imports: [RouterLink],
  standalone: true,
  providers: [WorkoutService],
  templateUrl: './workout-list.html',
  styleUrl: './workout-list.css',
})
export class WorkoutList {
  workoutPlayerService = inject(WorkoutPlayerService);
  readonly mockService = inject(MockService);
  readonly workoutService = inject(WorkoutService);
  
  startWorkout(workout: Workout) {
    this.workoutPlayerService.playWorkout(workout);
  }
}
