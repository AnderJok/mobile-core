import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { WorkoutPlayerService } from '../services/workout-player.service';

export const activeWorkoutGuard: CanActivateFn = () => {
    const workoutPlayerService = inject(WorkoutPlayerService);
    const router = inject(Router);

    return workoutPlayerService.isPlaying() ? true : router.createUrlTree(['/home']);
};
