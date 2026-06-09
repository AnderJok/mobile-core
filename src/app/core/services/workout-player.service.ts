import { Injectable, signal } from "@angular/core";
import { Workout } from "../../shared/interfaces/workout";

@Injectable({
  providedIn: 'root'
})
export class WorkoutPlayerService {
    readonly isPlaying = signal<boolean>(false);
    readonly activeWorkout = signal<Workout | null>(null);

    playWorkout(workout: Workout) {
        this.isPlaying.set(true);
        this.activeWorkout.set(workout);
    }

    stopWorkout() {
        this.isPlaying.set(false);
        this.activeWorkout.set(null);
    }

    togglePlayPause() {
        this.isPlaying.update(isPlaying => !isPlaying);
    }
}