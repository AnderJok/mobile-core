import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Workout } from '../shared/interfaces/workout';
import { environment } from '../../environments/environments';

@Injectable({
    providedIn: 'root'
})
export class WorkoutService {

    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    private workoutsSignal: WritableSignal<Workout[]> = signal([]);
    readonly workouts = this.workoutsSignal.asReadonly();

    constructor() {
        this.getAllWorkouts();
    }

    createWorkout(workout: Workout) {
        return this.http.post<Workout>(this.apiUrl + 'workouts', workout);
    }

    private getAllWorkouts() {
        this.http.get<Workout[]>(this.apiUrl + 'workouts').subscribe(workouts => {
            this.workoutsSignal.set(workouts);
        });
    }
}