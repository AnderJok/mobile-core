import { Component, inject } from '@angular/core';
import { WorkoutPlayerService } from '../../services/workout-player.service';

@Component({
  selector: 'app-global-player',
  imports: [],
  templateUrl: './global-player.html',
  styleUrl: './global-player.css',
})
export class GlobalPlayer {
  workoutPlayerService = inject(WorkoutPlayerService);
}
