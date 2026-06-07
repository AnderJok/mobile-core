import { Component } from '@angular/core';
import { WorkoutFilter } from '../../components/workout-filter/workout-filter';
import { WorkoutBuilder } from '../workout-builder/workout-builder';
import { WorkoutList } from '../../components/workout-list/workout-list';

@Component({
  selector: 'app-workouts',
  imports: [WorkoutList, WorkoutBuilder, WorkoutFilter],
  templateUrl: './workouts.html',
  styleUrl: './workouts.css',
})
export class Workouts {}
