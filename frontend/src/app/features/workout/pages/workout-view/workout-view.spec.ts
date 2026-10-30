import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { environment } from '../../../../../environments/environments';
import { Workout } from '../../../../shared/interfaces/workout';
import { WorkoutView } from './workout-view';

describe('WorkoutView', () => {
    let fixture: ComponentFixture<WorkoutView>;
    let http: HttpTestingController;
    const url = environment.apiUrl + 'workouts';
    const workout: Workout = {
        id: 'workout-1', name: 'Core', description: 'Description', tags: [{ id: 1, name: 'Strength' }],
        blocks: [
            { id: 'block-1', rounds: 2, restBetweenExercises: 10, restBetweenRounds: 30, restAfterBlock: 45, exercises: [] },
            { id: 'block-2', rounds: 1, restBetweenExercises: 0, restBetweenRounds: 0, restAfterBlock: 90, exercises: [] },
        ],
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [WorkoutView],
            providers: [
                provideHttpClient(), provideHttpClientTesting(), provideRouter([]),
                { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: workout.id }) } } },
            ],
        });
        fixture = TestBed.createComponent(WorkoutView);
        http = TestBed.inject(HttpTestingController);
        http.expectOne(url).flush([]);
    });

    afterEach(() => http.verify());

    it('loads details directly and displays rest only between blocks', () => {
        http.expectOne(url + '/' + workout.id).flush(workout);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Core');
        expect(fixture.nativeElement.textContent).toContain('Rest before next block: 45 s');
        expect(fixture.nativeElement.textContent).not.toContain('Rest before next block: 90 s');
    });

    it('displays load errors and retries the read request', () => {
        http.expectOne(url + '/' + workout.id).flush('Missing', { status: 404, statusText: 'Not Found' });
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
        fixture.componentInstance.loadWorkout();
        http.expectOne(url + '/' + workout.id).flush(workout);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
    });
});
