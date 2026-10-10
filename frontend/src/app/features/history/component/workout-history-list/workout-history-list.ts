import { Component, computed, inject, signal } from '@angular/core';
import { HistoryRecord } from '../../../../shared/interfaces/history-record';
import { MockService } from '../../../../core/services/mock.service';
import { Workout } from '../../../../shared/interfaces/workout';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-workout-history-list',
  imports: [DatePipe],
  templateUrl: './workout-history-list.html',
  styleUrl: './workout-history-list.css',
})
export class WorkoutHistoryList {
    mockService = inject(MockService);
    private historyRecords = signal<HistoryRecord[]>([]);

    historyWorkoutList = computed(() => {
      return this.historyRecords()
        .map(record => {
          const workout = this.mockService.workouts().find(w => w.id === record.workoutId);
          return workout ? { workout, date: record.date } : null;
        })
        .filter((item): item is { workout: Workout; date: Date } => item !== null);
    })
    

    ngOnInit() {
      this.historyRecords.set(this.mockService.getAllHistoryRecords());
    }
}
