import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { appConfig } from '../app.config';
import { Workout } from '../shared/interfaces/workout';
import { environment } from '../../environments/environments';
import { WorkoutService } from './workout.service';

describe('WorkoutService', () => {
    it('loads the backend workouts into the signal with the application providers', () => {
        TestBed.configureTestingModule({
            providers: [...appConfig.providers, provideHttpClientTesting()]
        });

        const service = TestBed.inject(WorkoutService);
        const httpTesting = TestBed.inject(HttpTestingController);
        const workouts: Workout[] = [
            { id: 'wk-1', name: 'Upper Body', description: '', tags: [], blocks: [] },
            { id: 'wk-2', name: 'Lower Body', description: '', tags: [], blocks: [] }
        ];

        expect(service.workouts()).toEqual([]);
        const request = httpTesting.expectOne(environment.apiUrl + 'workouts');
        expect(request.request.method).toBe('GET');
        request.flush(workouts);

        expect(service.workouts()).toEqual(workouts);
        expect(service.getWorkouts()).toEqual(workouts);
        httpTesting.verify();
    });
});