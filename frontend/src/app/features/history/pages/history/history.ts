import { Component } from '@angular/core';
import { HistoryGraph } from '../../component/history-graph/history-graph';
import { WorkoutHistoryList } from '../../component/workout-history-list/workout-history-list';

@Component({
  selector: 'app-history',
  imports: [HistoryGraph, WorkoutHistoryList],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History {}
