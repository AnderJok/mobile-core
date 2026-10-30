import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ExerciseType } from '../../shared/interfaces/exercise-type';
import { Workout } from '../../shared/interfaces/workout';
import { WorkoutPlayerService } from './workout-player.service';

describe('WorkoutPlayerService', () => {
    let service: WorkoutPlayerService;
    let workout: Workout;

    beforeEach(() => {
        service = TestBed.inject(WorkoutPlayerService);
        workout = {
            id: 'workout', name: 'Circuit', description: '', tags: [],
            blocks: [
                {
                    id: 'block-1', rounds: 2, restBetweenExercises: 10,
                    restBetweenRounds: 20, restAfterBlock: 30,
                    exercises: [
                        {
                            id: 'squat', targetValue: 8, weight: 12,
                            exercise: {
                                name: 'Squat', description: 'Squat instructions', type: ExerciseType.REPS,
                                hasVariations: false, tags: [],
                            },
                        },
                        {
                            id: 'plank', targetValue: 45,
                            exercise: {
                                name: 'Plank', description: '', type: ExerciseType.TIME,
                                hasVariations: false, tags: [],
                            },
                        },
                    ],
                },
                {
                    id: 'block-2', rounds: 1, restBetweenExercises: 15,
                    restBetweenRounds: 25, restAfterBlock: 60,
                    exercises: [{
                        id: 'lunge', targetValue: 6,
                        exercise: {
                            name: 'Lunge', description: '', type: ExerciseType.REPS,
                            hasVariations: true, tags: [],
                        },
                    }],
                },
            ],
        };
    });

    afterEach(() => {
        service.stopWorkout();
        vi.useRealTimers();
    });

    it('visits every exercise and round in order, inserting only the rest for each boundary', () => {
        const original = structuredClone(workout);
        service.playWorkout(workout);
        const visited = [];
        const ids = new Set<string>();
        while (service.currentStep()) {
            const step = service.currentStep()!;
            ids.add(step.id);
            visited.push([
                step.name, step.targetValue, step.blockIndex, step.roundIndex, step.exerciseIndex, step.side,
            ]);
            expect(service.stepNumber()).toBe(visited.length);
            expect(service.totalSteps()).toBe(10);
            service.nextStep();
        }

        expect(visited).toEqual([
            ['Squat', 8, 0, 0, 0, 'NONE'],
            ['Rest between exercises', 10, 0, 0, 0, 'NONE'],
            ['Plank', 45, 0, 0, 1, 'NONE'],
            ['Rest between rounds', 20, 0, 0, 1, 'NONE'],
            ['Squat', 8, 0, 1, 0, 'NONE'],
            ['Rest between exercises', 10, 0, 1, 0, 'NONE'],
            ['Plank', 45, 0, 1, 1, 'NONE'],
            ['Rest between blocks', 30, 0, 1, 1, 'NONE'],
            ['Lunge', 6, 1, 0, 0, 'L'],
            ['Lunge', 6, 1, 0, 0, 'R'],
        ]);
        expect(ids.size).toBe(10);
        expect(workout).toEqual(original);
        expect(service.activeWorkout()).toBeNull();
        expect(service.isPlaying()).toBe(false);
        expect(service.upcomingStep()).toBeNull();
        expect(service.stepNumber()).toBe(0);
        expect(service.totalSteps()).toBe(0);
    });

    it('exposes exercise targets, description, weight and the upcoming rest', () => {
        service.playWorkout(workout);
        expect(service.currentStep()).toMatchObject({
            type: 'EXERCISE', valueType: 'REPS', targetValue: 8,
            weight: 12, description: 'Squat instructions',
        });
        expect(service.currentBlock()).toBe(workout.blocks[0]);
        expect(service.upcomingStep()).toMatchObject({ type: 'REST', valueType: 'TIME', targetValue: 10 });
        service.nextStep();
        service.nextStep();
        expect(service.currentStep()).toMatchObject({ name: 'Plank', valueType: 'TIME', targetValue: 45 });
    });

    it('skips all zero rests without skipping exercises or rounds', () => {
        workout.blocks.forEach(block => {
            block.restBetweenExercises = 0;
            block.restBetweenRounds = 0;
            block.restAfterBlock = 0;
        });
        service.playWorkout(workout);
        expect(service.totalSteps()).toBe(6);
        for (let index = 0; index < 6; index++) {
            expect(service.currentStep()?.type).toBe('EXERCISE');
            service.nextStep();
        }
        expect(service.activeWorkout()).toBeNull();
    });

    it('uses only round rests for a single-exercise block, with no trailing rest', () => {
        workout.blocks = [workout.blocks[0]];
        workout.blocks[0].exercises = [workout.blocks[0].exercises[0]];
        service.playWorkout(workout);
        expect(service.totalSteps()).toBe(3);
        service.nextStep();
        expect(service.currentStep()?.name).toBe('Rest between rounds');
        service.nextStep();
        expect(service.upcomingStep()).toBeNull();
        service.nextStep();
        expect(service.activeWorkout()).toBeNull();
    });

    it('preserves the current step on pause and advances while paused without resuming', () => {
        service.playWorkout(workout);
        const firstStep = service.currentStep();
        service.togglePlayPause();
        expect(service.currentStep()).toBe(firstStep);
        service.nextStep();
        expect(service.currentStep()?.type).toBe('REST');
        expect(service.isPlaying()).toBe(false);
        service.togglePlayPause();
        expect(service.isPlaying()).toBe(true);
        expect(service.currentStep()?.type).toBe('REST');
    });

    it('clears state on stop and starts another workout from its first step', () => {
        service.playWorkout(workout);
        service.nextStep();
        service.togglePlayPause();
        const another = { ...workout, id: 'another', blocks: [workout.blocks[1]] };
        service.playWorkout(another);
        expect(service.activeWorkout()).toBe(another);
        expect(service.currentStep()).toMatchObject({ name: 'Lunge', blockIndex: 0, roundIndex: 0, side: 'L' });
        expect(service.stepNumber()).toBe(1);
        expect(service.isPlaying()).toBe(true);
        service.stopWorkout();
        expect(service.currentStep()).toBeNull();
        expect(service.currentBlock()).toBeNull();
        expect(service.totalSteps()).toBe(0);
        service.nextStep();
        service.togglePlayPause();
        expect(service.isPlaying()).toBe(false);
    });

    it('reports an invalid empty workout without replacing a running session', () => {
        const log = vi.spyOn(console, 'error').mockImplementation(() => {});
        service.playWorkout(workout);
        service.playWorkout({ ...workout, blocks: [] });
        expect(log).toHaveBeenCalledOnce();
        expect(service.error()).toContain('Cannot start');
        expect(service.activeWorkout()).toBe(workout);
        service.playWorkout(workout);
        expect(service.error()).toBe('');
        log.mockRestore();
    });

    it('runs a session timer that pauses, resumes and freezes on stop', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
        service.playWorkout(workout);
        expect(service.elapsedLabel()).toBe('00:00');

        vi.advanceTimersByTime(65_000);
        expect(service.elapsedMs()).toBe(65_000);
        expect(service.elapsedLabel()).toBe('01:05');

        service.togglePlayPause();
        vi.advanceTimersByTime(10_000);
        expect(service.elapsedMs()).toBe(65_000);
        expect(service.elapsedLabel()).toBe('01:05');

        service.togglePlayPause();
        vi.advanceTimersByTime(4_000);
        expect(service.elapsedMs()).toBe(69_000);
        expect(service.elapsedLabel()).toBe('01:09');

        service.stopWorkout();
        vi.advanceTimersByTime(8_000);
        expect(service.elapsedMs()).toBe(69_000);
        expect(service.elapsedLabel()).toBe('01:09');
        vi.useRealTimers();
    });

    it('restarts the session timer when a new workout starts and freezes it after the last step', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
        service.playWorkout(workout);
        vi.advanceTimersByTime(12_000);
        expect(service.elapsedLabel()).toBe('00:12');

        const another = { ...workout, id: 'another', blocks: [workout.blocks[1]] };
        service.playWorkout(another);
        expect(service.elapsedLabel()).toBe('00:00');
        vi.advanceTimersByTime(3_000);
        expect(service.elapsedLabel()).toBe('00:03');

        while (service.upcomingStep()) {
            service.nextStep();
        }
        service.nextStep();
        expect(service.activeWorkout()).toBeNull();
        vi.advanceTimersByTime(5_000);
        expect(service.elapsedLabel()).toBe('00:03');
        vi.useRealTimers();
    });

    it('rejects empty blocks and invalid rounds instead of creating an empty session', () => {
        const log = vi.spyOn(console, 'error').mockImplementation(() => {});
        for (const rounds of [0, -1, 1.5]) {
            workout.blocks[0].rounds = rounds;
            service.playWorkout(workout);
            expect(service.activeWorkout()).toBeNull();
            expect(service.error()).not.toBe('');
        }
        workout.blocks[0].rounds = 1;
        workout.blocks[0].exercises = [];
        service.playWorkout(workout);
        expect(service.activeWorkout()).toBeNull();
        expect(log).toHaveBeenCalledTimes(4);
        log.mockRestore();
    });
});
