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

    getAllExercises() {
        this.http.get<Exercise[]>(this.apiUrl + 'exercises').subscribe(exercises => {
            this.exercisesSignal.set(exercises);
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