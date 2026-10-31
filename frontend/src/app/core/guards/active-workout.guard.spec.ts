import { Component } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { SEED_WORKOUTS } from '../services/mock.service';
import { WorkoutPlayerService } from '../services/workout-player.service';
import { activeWorkoutGuard } from './active-workout.guard';

@Component({ template: '' })
class RoutePage {}

describe('activeWorkoutGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([
                { path: 'home', component: RoutePage },
                { path: 'active-workout/:id', component: RoutePage, canActivate: [activeWorkoutGuard] },
            ])],
        });
    });

    it('allows opening the active workout even while paused', async () => {
        const service = TestBed.inject(WorkoutPlayerService);
        service.playWorkout(SEED_WORKOUTS[0]);
        service.togglePlayPause();
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/active-workout/wk-1');
        expect(TestBed.inject(Router).url).toBe('/active-workout/wk-1');
    });

    it('redirects home without an active session', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/active-workout/wk-1');
        expect(TestBed.inject(Router).url).toBe('/home');
    });
});
