import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WorkoutPlayerService } from '../../../../core/services/workout-player.service';
import { Workout } from '../../../../shared/interfaces/workout';
import { HistoryService } from '../../../../services/history.service';
import { DurationPipe } from '../../../../shared/pipes/duration.pipe';

@Component({
  selector: 'app-recent-workouts',
  imports: [DatePipe, DurationPipe],
  templateUrl: './recent-workouts.html',
  styleUrl: './recent-workouts.css',
})
export class RecentWorkouts {
  workoutPlayerService = inject(WorkoutPlayerService);
  historyService = inject(HistoryService);

  ngOnInit() {
    this.historyService.getRecentWorkouts(3);
  }

  startWorkout(workout: Workout) {
    this.workoutPlayerService.playWorkout(workout);
  }
}
