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
    private readonly steps = signal<ActiveStep[]>([]);
    private readonly stepIndex = signal(0);
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
    }

    stopWorkout() {
        this.isPlaying.set(false);
        this.activeWorkout.set(null);
        this.steps.set([]);
        this.stepIndex.set(0);
        this.error.set('');
    }

    togglePlayPause() {
        if (this.activeWorkout()) {
            this.isPlaying.update(isPlaying => !isPlaying);
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
}