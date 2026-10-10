import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { toSignal } from '@angular/core/rxjs-interop';
import { Workout } from '../shared/interfaces/workout';
import { environment } from '../../environments/environments';

@Injectable({
    providedIn: 'root'
})
export class TestService {

    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    workouts = toSignal(
        this.http.get<Workout[]>(this.apiUrl + 'workouts'), 
        { initialValue: [] }
    );
}