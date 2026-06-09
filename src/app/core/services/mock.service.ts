import { Injectable, signal, WritableSignal } from "@angular/core";
import { Exercise } from "../../shared/interfaces/exercise";
import { ExerciseType } from "../../shared/interfaces/exercise-type";
import { MuscleGroup } from "../../shared/interfaces/muscle-group";
import { Workout } from "../../shared/interfaces/workout";

const SEED_MUSCLE_GROUPS: MuscleGroup[] = [
  { id: 1, name: 'Pecho' },
  { id: 2, name: 'Espalda' },
  { id: 3, name: 'Piernas' },
  { id: 4, name: 'Brazos' },
  { id: 5, name: 'Hombros' },
  { id: 6, name: 'Abdomen' }
];

const SEED_EXERCISES: Exercise[] = [
  {
    id: 1,
    name: 'Press de Banca',
    description: 'Ejercicio de press con barra',
    muscleGroup: [SEED_MUSCLE_GROUPS[0]],
    type: ExerciseType.REPS,
    hasVariations: true,
    defaultValue: 10,
    tags: ['fuerza', 'pecho']
  },
  {
    id: 2,
    name: 'Sentadillas',
    description: 'Ejercicio de piernas',
    muscleGroup: [SEED_MUSCLE_GROUPS[2]],
    type: ExerciseType.REPS,
    hasVariations: true,
    defaultValue: 12,
    tags: ['fuerza', 'piernas']
  },
  {
    id: 3,
    name: 'Fondos en Paralelas',
    description: 'Ejercicio de tríceps y pecho',
    muscleGroup: [SEED_MUSCLE_GROUPS[0], SEED_MUSCLE_GROUPS[3]],
    type: ExerciseType.REPS,
    hasVariations: false,
    defaultValue: 8,
    tags: ['fuerza', 'triceps']
  },
  {
    id: 4,
    name: 'Plancha',
    description: 'Ejercicio isométrico de abdomen',
    muscleGroup: [SEED_MUSCLE_GROUPS[5]],
    type: ExerciseType.TIME,
    hasVariations: true,
    defaultValue: 60,
    tags: ['resistencia', 'abdomen']
  },
  {
    id: 5,
    name: 'Remo con Barra',
    description: 'Ejercicio de espalda',
    muscleGroup: [SEED_MUSCLE_GROUPS[1]],
    type: ExerciseType.REPS,
    hasVariations: true,
    defaultValue: 10,
    tags: ['fuerza', 'espalda']
  }
];

const SEED_WORKOUTS: Workout[] = [
  {
    id: '1',
    name: 'Upper Body',
    description: 'Entrenamiento de tren superior',
    tags: ['fuerza', 'tren-superior'],
    blocks: [
      {
        id: '1-1',
        exercises: [
          {
            exercise: SEED_EXERCISES[0],
            targetValue: 10,
            weight: 60
          },
          {
            exercise: SEED_EXERCISES[2],
            targetValue: 8,
            weight: 0
          }
        ],
        restBetweenExercises: 90,
        restAfterBlock: 180
      },
      {
        id: '1-2',
        exercises: [
          {
            exercise: SEED_EXERCISES[4],
            targetValue: 10,
            weight: 50
          }
        ],
        restBetweenExercises: 60,
        restAfterBlock: 120
      }
    ]
  },
  {
    id: '2',
    name: 'Lower Body',
    description: 'Entrenamiento de tren inferior',
    tags: ['fuerza', 'tren-inferior'],
    blocks: [
      {
        id: '2-1',
        exercises: [
          {
            exercise: SEED_EXERCISES[1],
            targetValue: 12,
            weight: 80
          }
        ],
        restBetweenExercises: 120,
        restAfterBlock: 240
      }
    ]
  },
  {
    id: '3',
    name: 'Core Workout',
    description: 'Entrenamiento de núcleo',
    tags: ['resistencia', 'core'],
    blocks: [
      {
        id: '3-1',
        exercises: [
          {
            exercise: SEED_EXERCISES[3],
            targetValue: 60,
            weight: 0
          }
        ],
        restBetweenExercises: 60,
        restAfterBlock: 120
      }
    ]
  }
];

@Injectable({
    providedIn: 'root'
})
export class MockService {
    private muscleGroupsSignal: WritableSignal<MuscleGroup[]> = signal([]);
    private exercisesSignal: WritableSignal<Exercise[]> = signal([]);
    private workoutsSignal: WritableSignal<Workout[]> = signal([]);

    readonly muscleGroups = this.muscleGroupsSignal.asReadonly();
    readonly exercises = this.exercisesSignal.asReadonly();
    readonly workouts = this.workoutsSignal.asReadonly();

    constructor() {
        this.setDefaultData();
    }

    private setDefaultData(): void {
        this.muscleGroupsSignal.set(SEED_MUSCLE_GROUPS);
        this.exercisesSignal.set(SEED_EXERCISES);
        this.workoutsSignal.set(SEED_WORKOUTS);
        return;
    }

    addExercise(exercise: Exercise): void {}

    updateExercise(idExercise: number, exercise: Exercise): void {}

    deleteExercise(idExercise: number): void {}

    addWorkout(workout: Workout): void {}

    updateWorkout(idWorkout: number, workout: Workout): void {}

    deleteWorkout(idWorkout: number): void {}

}