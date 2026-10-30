import { computed, Injectable, signal } from "@angular/core";
import { ActiveStep } from "../../shared/interfaces/active-step";
import { Workout } from "../../shared/interfaces/workout";

@Injectable({
  providedIn: 'root'
})
export class WorkoutPlayerService {
    readonly isPlaying = signal<boolean>(false);
    readonly activeWorkout = signal<Workout | null>(null);
    readonly error = signal('');
    readonly elapsedMs = signal(0);
    readonly elapsedLabel = computed(() => formatElapsed(this.elapsedMs()));
    private readonly steps = signal<ActiveStep[]>([]);
    private readonly stepIndex = signal(0);
    private elapsedOffsetMs = 0;
    private runningSinceMs: number | null = null;
    private ticker: ReturnType<typeof setInterval> | null = null;
    readonly currentStep = computed(() => this.steps()[this.stepIndex()] ?? null);
    readonly upcomingStep = computed(() => this.steps()[this.stepIndex() + 1] ?? null);
    readonly stepNumber = computed(() => this.currentStep() ? this.stepIndex() + 1 : 0);
    readonly totalSteps = computed(() => this.steps().length);
    readonly currentBlock = computed(() => {
        const step = this.currentStep();
        return step ? this.activeWorkout()?.blocks[step.blockIndex] ?? null : null;
    });

    playWorkout(workout: Workout) {
        if (!workout.blocks.length || workout.blocks.some(block =>
            !block.exercises.length || !Number.isInteger(block.rounds) || block.rounds < 1)) {
            const message = 'Cannot start a workout without exercises and positive integer rounds in every block.';
            console.error(message);
            this.error.set(message);
            return;
        }

        this.error.set('');
        this.steps.set(this.buildSteps(workout));
        this.stepIndex.set(0);
        this.activeWorkout.set(workout);
        this.isPlaying.set(true);
        this.resetAndStartTimer();
    }

    stopWorkout() {
        this.pauseTimer();
        this.isPlaying.set(false);
        this.activeWorkout.set(null);
        this.steps.set([]);
        this.stepIndex.set(0);
        this.error.set('');
    }

    togglePlayPause() {
        if (!this.activeWorkout()) {
            return;
        }
        this.isPlaying.update(isPlaying => !isPlaying);
        if (this.isPlaying()) {
            this.resumeTimer();
        } else {
            this.pauseTimer();
        }
    }

    nextStep() {
        if (!this.currentStep()) {
            return;
        }
        if (!this.upcomingStep()) {
            this.stopWorkout();
            return;
        }
        this.stepIndex.update(index => index + 1);
    }

    previousStep() {
        if (!this.currentStep()) {
            return;
        }
        if (this.stepIndex() === 0) {
            return;
        }
        this.stepIndex.update(index => index - 1);
    }

    private buildSteps(workout: Workout): ActiveStep[] {
        const steps: ActiveStep[] = [];

        workout.blocks.forEach((block, blockIndex) => {
            for (let roundIndex = 0; roundIndex < block.rounds; roundIndex++) {
                block.exercises.forEach((instance, exerciseIndex) => {
                    const position = { blockIndex, roundIndex, exerciseIndex };
                    const addRest = (name: string, seconds: number) => {
                        if (seconds > 0) {
                            steps.push({
                                ...position, id: `step-${steps.length}`, type: 'REST',
                                name, valueType: 'TIME', targetValue: seconds,
                                side: 'NONE', description: '',
                            });
                        }
                    };
                    const sides: ActiveStep['side'][] = instance.exercise.hasVariations
                        ? ['L', 'R'] : ['NONE'];
                    for (const side of sides) {
                        steps.push({
                            ...position, id: `step-${steps.length}`, type: 'EXERCISE',
                            name: instance.exercise.name, valueType: instance.exercise.type,
                            targetValue: instance.targetValue, weight: instance.weight,
                            side, description: instance.exercise.description,
                            exerciseInstanceId: instance,
                        });
                    }

                    if (exerciseIndex < block.exercises.length - 1) {
                        addRest('Rest between exercises', block.restBetweenExercises);
                    } else if (roundIndex < block.rounds - 1) {
                        addRest('Rest between rounds', block.restBetweenRounds);
                    } else if (blockIndex < workout.blocks.length - 1) {
                        addRest('Rest between blocks', block.restAfterBlock);
                    }
                });
            }
        });

        return steps;
    }

    private resetAndStartTimer() {
        this.clearTicker();
        this.elapsedOffsetMs = 0;
        this.elapsedMs.set(0);
        this.resumeTimer();
    }

    private resumeTimer() {
        this.runningSinceMs = Date.now();
        this.syncElapsed();
        this.clearTicker();
        this.ticker = setInterval(() => this.syncElapsed(), 250);
    }

    private pauseTimer() {
        this.syncElapsed();
        this.elapsedOffsetMs = this.elapsedMs();
        this.runningSinceMs = null;
        this.clearTicker();
    }

    private syncElapsed() {
        if (this.runningSinceMs === null) {
            return;
        }
        this.elapsedMs.set(this.elapsedOffsetMs + (Date.now() - this.runningSinceMs));
    }

    private clearTicker() {
        if (this.ticker !== null) {
            clearInterval(this.ticker);
            this.ticker = null;
        }
    }
}

function formatElapsed(ms: number): string {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}