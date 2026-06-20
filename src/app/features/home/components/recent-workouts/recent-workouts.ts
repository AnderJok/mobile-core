import { Component, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WorkoutPlayerService } from '../../../../core/services/workout-player.service';
import { MockService } from '../../../../core/services/mock.service';
import { Workout } from '../../../../shared/interfaces/workout';
import { HistoryRecord } from '../../../../shared/interfaces/history-record';

@Component({
  selector: 'app-recent-workouts',
  imports: [DatePipe],
  templateUrl: './recent-workouts.html',
  styleUrl: './recent-workouts.css',
})
export class RecentWorkouts {
  workoutPlayerService = inject(WorkoutPlayerService);
  mockService = inject(MockService);

  private last3HistoryRecords = signal<HistoryRecord[]>([]);

  last3Workouts = computed(() => {
    return this.last3HistoryRecords()
      .map(record => {
        const workout = this.mockService.workouts().find(w => w.id === record.workoutId);
        return workout ? { workout, date: record.date } : null;
      })
      .filter((item): item is { workout: Workout; date: Date } => item !== null);
  });

  ngOnInit() {
    this.last3HistoryRecords.set(this.mockService.getLastHistoryRecords(3));
  }

  startWorkout(workout: Workout) {
    this.workoutPlayerService.playWorkout(workout);
  }
}
