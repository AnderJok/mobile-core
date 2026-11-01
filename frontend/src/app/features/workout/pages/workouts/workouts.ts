import { Component } from '@angular/core';
import { WorkoutFilter } from '../../components/workout-filter/workout-filter';
import { WorkoutList } from '../../components/workout-list/workout-list';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-workouts',
  imports: [WorkoutList, WorkoutFilter, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './workouts.html',
  styleUrl: './workouts.css',
})
export class Workouts {}
