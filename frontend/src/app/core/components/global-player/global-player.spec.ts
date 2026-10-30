import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { environment } from '../../../../environments/environments';
import { WorkoutList } from '../../../features/workout/components/workout-list/workout-list';
import { ActiveWorkout } from '../../../features/workout/pages/active-workout/active-workout';
import { SEED_WORKOUTS } from '../../services/mock.service';
import { WorkoutPlayerService } from '../../services/workout-player.service';
import { GlobalPlayer } from './global-player';

describe('GlobalPlayer workout progression', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [GlobalPlayer, WorkoutList, ActiveWorkout],
            providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
        });
    });

    it('starts from the list and keeps both player surfaces in sync through pause, next and completion', () => {
        const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
        const list = TestBed.createComponent(WorkoutList);
        const http = TestBed.inject(HttpTestingController);
        const workout = structuredClone(SEED_WORKOUTS[0]);
        workout.blocks[0].rounds = 1;
        http.expectOne(environment.apiUrl + 'workouts').flush([workout]);
        list.detectChanges();
        const start = Array.from<HTMLButtonElement>(list.nativeElement.querySelectorAll('button'))
            .find(button => button.textContent?.trim() === 'Start')!;
        start.click();

        const player = TestBed.createComponent(GlobalPlayer);
        const page = TestBed.createComponent(ActiveWorkout);
        const service = TestBed.inject(WorkoutPlayerService);
        player.detectChanges();
        page.detectChanges();
        expect(player.nativeElement.textContent).toContain('Press de Banca');
        expect(player.nativeElement.textContent).toContain('10 reps');
        expect(page.nativeElement.textContent).toContain('Press de Banca');
        const buttons = Array.from<HTMLButtonElement>(player.nativeElement.querySelectorAll('button'));
        const pause = buttons.find(button => button.textContent?.includes('PAUSE'))!;
        const next = buttons.find(button => button.textContent?.includes('NEXT'))!;
        pause.click();
        next.click();
        player.detectChanges();
        page.detectChanges();
        expect(service.isPlaying()).toBe(false);
        expect(player.nativeElement.textContent).toContain('Rest between exercises');
        expect(player.nativeElement.textContent).toContain('90 s');
        expect(page.nativeElement.textContent).toContain('Rest between exercises');

        const pageNext = Array.from<HTMLButtonElement>(page.nativeElement.querySelectorAll('button'))
            .find(button => button.textContent?.trim() === 'Next')!;
        pageNext.click();
        player.detectChanges();
        page.detectChanges();
        expect(player.nativeElement.textContent).toContain('Remo con Barra');
        expect(page.nativeElement.textContent).toContain('Last step');
        next.click();
        player.detectChanges();
        expect(service.activeWorkout()).toBeNull();
        expect(player.nativeElement.querySelector('.navbar')).toBeNull();
        expect(navigate).toHaveBeenCalledWith(['/home']);
        http.verify();
    });

    it('displays startup errors instead of showing an empty player', () => {
        const log = vi.spyOn(console, 'error').mockImplementation(() => {});
        TestBed.inject(WorkoutPlayerService).playWorkout({ ...SEED_WORKOUTS[0], blocks: [] });
        const player = TestBed.createComponent(GlobalPlayer);
        player.detectChanges();
        expect(player.nativeElement.querySelector('[role="alert"]').textContent).toContain('Cannot start');
        expect(player.nativeElement.querySelector('.navbar')).toBeNull();
        log.mockRestore();
    });

    it('stops and clears progress from the global player', () => {
        const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
        const service = TestBed.inject(WorkoutPlayerService);
        service.playWorkout(SEED_WORKOUTS[0]);
        service.nextStep();
        const player = TestBed.createComponent(GlobalPlayer);
        player.detectChanges();
        const stop = Array.from<HTMLButtonElement>(player.nativeElement.querySelectorAll('button'))
            .find(button => button.textContent?.trim() === 'STOP')!;
        stop.click();
        player.detectChanges();
        expect(service.currentStep()).toBeNull();
        expect(service.totalSteps()).toBe(0);
        expect(service.isPlaying()).toBe(false);
        expect(player.nativeElement.querySelector('.navbar')).toBeNull();
        expect(navigate).toHaveBeenCalledWith(['/home']);
    });

    it('finishes from the active workout page after the last exercise', () => {
        const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
        const service = TestBed.inject(WorkoutPlayerService);
        const workout = structuredClone(SEED_WORKOUTS[0]);
        workout.blocks[0].rounds = 1;
        workout.blocks[0].exercises = [workout.blocks[0].exercises[0]];
        service.playWorkout(workout);
        const page = TestBed.createComponent(ActiveWorkout);
        page.detectChanges();
        const next = Array.from<HTMLButtonElement>(page.nativeElement.querySelectorAll('button'))
            .find(button => button.textContent?.trim() === 'Next')!;
        next.click();
        expect(service.activeWorkout()).toBeNull();
        expect(service.currentStep()).toBeNull();
        expect(navigate).toHaveBeenCalledWith(['/home']);
    });
});
