import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Workout, WorkoutInput } from '../shared/interfaces/workout';
import { environment } from '../../environments/environments';
import { WorkoutService } from './workout.service';

describe('WorkoutService', () => {
    let service: WorkoutService;
    let http: HttpTestingController;
    const url = environment.apiUrl;
    const workout: Workout = { id: 'wk-1', name: 'Upper Body', description: '', tags: [], blocks: [] };
    const input: WorkoutInput = { name: 'Upper Body', description: '', tags: [], blocks: [] };

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
        service = TestBed.inject(WorkoutService);
        http = TestBed.inject(HttpTestingController);
    });

    afterEach(() => http.verify());

    it('loads workouts into the shared signal', () => {
        expect(service.loading()).toBe(true);
        http.expectOne(url + 'workouts').flush([workout]);
        expect(service.workouts()).toEqual([workout]);
        expect(service.loading()).toBe(false);
    });

    it('updates the shared list after create, edit and delete succeed', () => {
        http.expectOne(url + 'workouts').flush([]);
        service.createWorkout(input).subscribe();
        const create = http.expectOne(url + 'workouts');
        expect(create.request.method).toBe('POST');
        expect(create.request.body).toEqual(input);
        create.flush(workout);
        expect(service.workouts()).toEqual([workout]);
        service.updateWorkout(workout.id, { ...input, name: 'Edited' }).subscribe();
        const update = http.expectOne(url + 'workouts/' + workout.id);
        expect(update.request.method).toBe('PUT');
        update.flush({ ...workout, name: 'Edited' });
        expect(service.workouts()[0].name).toBe('Edited');
        service.deleteWorkoutById(workout.id).subscribe();
        const deletion = http.expectOne(url + 'workouts/' + workout.id);
        expect(deletion.request.method).toBe('DELETE');
        deletion.flush(null);
        expect(service.workouts()).toEqual([]);
    });

    it('does not remove a workout when deletion fails', () => {
        http.expectOne(url + 'workouts').flush([workout]);
        let failed = false;
        service.deleteWorkoutById(workout.id).subscribe({ error: () => failed = true });
        http.expectOne(url + 'workouts/' + workout.id).flush('Failed', { status: 500, statusText: 'Error' });
        expect(failed).toBe(true);
        expect(service.workouts()).toEqual([workout]);
    });

    it('reports list errors and supports retry', () => {
        http.expectOne(url + 'workouts').flush('Failed', { status: 500, statusText: 'Error' });
        expect(service.loadError()).toBeTruthy();
        expect(service.loading()).toBe(false);
        service.getAllWorkouts();
        http.expectOne(url + 'workouts').flush([workout]);
        expect(service.loadError()).toBe('');
        expect(service.workouts()).toEqual([workout]);
    });

    it('loads a single workout and manages selectable tags', () => {
        http.expectOne(url + 'workouts').flush([]);
        service.getWorkoutById(workout.id).subscribe(result => expect(result).toEqual(workout));
        http.expectOne(url + 'workouts/' + workout.id).flush(workout);
        service.getTags().subscribe(result => expect(result).toEqual([{ id: 1, name: 'Strength' }]));
        http.expectOne(url + 'workout-tags').flush([{ id: 1, name: 'Strength' }]);
        service.createTag('Mobility').subscribe();
        const create = http.expectOne(url + 'workout-tags');
        expect(create.request.method).toBe('POST');
        expect(create.request.body).toEqual({ name: 'Mobility' });
        create.flush({ id: 2, name: 'Mobility' });
    });
});
