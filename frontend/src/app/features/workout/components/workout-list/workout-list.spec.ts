import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../../environments/environments';
import { WorkoutService } from '../../../../services/workout.service';
import { Workout } from '../../../../shared/interfaces/workout';
import { WorkoutList } from './workout-list';

describe('WorkoutList', () => {
    let fixture: ComponentFixture<WorkoutList>;
    let http: HttpTestingController;
    const workout: Workout = { id: 'workout-1', name: 'Core', description: '', tags: [], blocks: [] };
    const url = environment.apiUrl + 'workouts';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [WorkoutList],
            providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
        });
        fixture = TestBed.createComponent(WorkoutList);
        http = TestBed.inject(HttpTestingController);
        http.expectOne(url).flush([workout]);
        fixture.detectChanges();
    });

    afterEach(() => http.verify());

    it('uses the root service and renders view and edit links', () => {
        expect(fixture.componentInstance.workoutService).toBe(TestBed.inject(WorkoutService));
        const links: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('a'));
        expect(links.map(link => link.getAttribute('href'))).toEqual([
            '/workout-view/workout-1', '/workout-builder/workout-1',
        ]);
    });

    it('requires confirmation, deletes and removes the card after success', () => {
        const deleteButton = Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button'))
            .find(button => button.textContent?.includes('Delete'))!;
        deleteButton.click();
        fixture.detectChanges();
        http.expectNone(url + '/' + workout.id);
        const confirmation: HTMLButtonElement = fixture.nativeElement.querySelector('[aria-label="Confirm workout deletion"] button');
        confirmation.click();
        const request = http.expectOne(url + '/' + workout.id);
        expect(request.request.method).toBe('DELETE');
        request.flush(null);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.workout-card')).toBeNull();
        expect(fixture.nativeElement.textContent).toContain('No workouts available');
    });

    it('keeps the workout and displays a failed deletion for retry', () => {
        fixture.componentInstance.deleteWorkout(workout);
        http.expectOne(url + '/' + workout.id).flush('Failed', { status: 500, statusText: 'Error' });
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Could not delete');
        expect(fixture.componentInstance.workoutService.workouts()).toEqual([workout]);
    });
});
