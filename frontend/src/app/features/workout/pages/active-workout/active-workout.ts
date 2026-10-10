import { Component, inject } from '@angular/core';
import { WorkoutPlayerService } from '../../../../core/services/workout-player.service';

@Component({
  selector: 'app-active-workout',
  imports: [],
  templateUrl: './active-workout.html',
  styleUrl: './active-workout.css',
})
export class ActiveWorkout {
  workoutPlayerService = inject(WorkoutPlayerService);
}
