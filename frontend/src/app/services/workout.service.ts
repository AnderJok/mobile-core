import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import { Workout, WorkoutInput } from '../shared/interfaces/workout';
import { WorkoutTag } from '../shared/interfaces/workout-tag';
import { environment } from '../../environments/environments';

@Injectable({
    providedIn: 'root'
})
export class WorkoutService {

    private http = inject(HttpClient);
    private workoutUrl = environment.apiUrl + 'workouts';
    private workoutTagsUrl = environment.apiUrl + 'workout-tags';

    private workoutsSignal: WritableSignal<Workout[]> = signal([]);
    readonly workouts = this.workoutsSignal.asReadonly();
    readonly loading = signal(false);
    readonly loadError = signal('');

    constructor() {
        this.getAllWorkouts();
    }

    createWorkout(workout: WorkoutInput) {
        return this.http.post<Workout>(this.workoutUrl, workout).pipe(
            tap(saved => this.workoutsSignal.update(workouts => [saved, ...workouts]))
        );
    }

    updateWorkout(id: string, workout: WorkoutInput) {
        return this.http.put<Workout>(this.workoutUrl + '/' + id, workout).pipe(
            tap(saved => this.workoutsSignal.update(workouts =>
                workouts.map(current => current.id === id ? saved : current)))
        );
    }

    getWorkoutById(id: string) {
        return this.http.get<Workout>(this.workoutUrl + '/' + id);
    }

    deleteWorkoutById(id: string) {
        return this.http.delete<void>(this.workoutUrl + '/' + id).pipe(
            tap(() => this.workoutsSignal.update(workouts => workouts.filter(workout => workout.id !== id)))
        );
    }

    getTags() {
        return this.http.get<WorkoutTag[]>(this.workoutTagsUrl);
    }

    createTag(name: string) {
        return this.http.post<WorkoutTag>(this.workoutTagsUrl, { name });
    }

    getAllWorkouts() {
        this.loading.set(true);
        this.loadError.set('');
        this.http.get<Workout[]>(this.workoutUrl).subscribe({
            next: workouts => {
                this.workoutsSignal.set(workouts);
                this.loading.set(false);
            },
            error: error => {
                console.error('Failed to load workouts:', error);
                this.loadError.set('Could not load workouts. Please retry.');
                this.loading.set(false);
            }
        });
    }
}