import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HistoryService } from '../../../../services/history.service';
import { DurationPipe } from '../../../../shared/pipes/duration.pipe';

@Component({
  selector: 'app-workout-history-list',
  imports: [DatePipe, DurationPipe],
  templateUrl: './workout-history-list.html',
  styleUrl: './workout-history-list.css',
})
export class WorkoutHistoryList {
    readonly historyService = inject(HistoryService);

    ngOnInit() {
      this.historyService.getAllHistoryRecords();
    }
}
