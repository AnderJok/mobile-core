import { Component } from '@angular/core';
import { RecentWorkouts } from '../../components/recent-workouts/recent-workouts';

@Component({
  selector: 'app-home',
  imports: [RecentWorkouts],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
