import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import { Exercise } from '../shared/interfaces/exercise';
import { environment } from '../../environments/environments';

@Injectable({
    providedIn: 'root'
})
export class ExerciseService {

    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    private exercisesSignal = signal<Exercise[]>([]);
    readonly exercises = this.exercisesSignal.asReadonly();
    readonly loadError = signal('');
    readonly loading = signal(false);

    constructor() {
        this.getAllExercises();
    }

    createExercise(exercise: Exercise) {
        return this.http.post<Exercise>(this.apiUrl + 'exercises', exercise).pipe(
            tap(savedExercise => {
                this.exercisesSignal.update(exercises => [...exercises, savedExercise]);
            })
        );
    }

    updateExercise(id: string, exercise: Exercise) {
        return this.http.put<Exercise>(this.apiUrl + 'exercises/' + id, exercise).pipe(
            tap(updatedExercise => {
                this.exercisesSignal.update(exercises =>
                    exercises.map(current => current.id === id ? updatedExercise : current)
                );
            })
        );
    }

    getAllExercises() {
        this.loading.set(true);
        this.loadError.set('');
        this.http.get<Exercise[]>(this.apiUrl + 'exercises').subscribe({
            next: exercises => {
                this.exercisesSignal.set(exercises);
                this.loading.set(false);
            },
            error: error => {
                console.error('Failed to load exercises:', error);
                this.loadError.set('Could not load exercises. Please retry.');
                this.loading.set(false);
            }
        });
    }

    deleteExerciseById(id: string) {
        return this.http.delete(this.apiUrl + 'exercises/' + id).pipe(
            tap(() => {
                this.exercisesSignal.update(exercises => exercises.filter(exercise => exercise.id !== id));
            })
        );
    }
}