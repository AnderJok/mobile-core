import { Injectable, signal, WritableSignal } from "@angular/core";
import { Exercise } from "../../shared/interfaces/exercise";
import { ExerciseType } from "../../shared/interfaces/exercise-type";
import { MuscleGroup } from "../../shared/interfaces/muscle-group";
import { Workout } from "../../shared/interfaces/workout";
import { WorkoutTag } from "../../shared/interfaces/workout-tag";
import { HistoryRecord } from "../../shared/interfaces/history-record";

export const SEED_MUSCLE_GROUPS: MuscleGroup[] = [
  { id: 1, name: 'Pecho' },
  { id: 2, name: 'Espalda' },
  { id: 3, name: 'Piernas' },
  { id: 4, name: 'Brazos' },
  { id: 5, name: 'Hombros' },
  { id: 6, name: 'Abdomen' },
  { id: 7, name: 'Antebrazos' } 
];

export const SEED_TAGS: WorkoutTag[] = [
  { id: 1, name: 'fuerza' },
  { id: 2, name: 'resistencia' },
  { id: 3, name: 'flexibilidad' },
  { id: 4, name: 'equilibrio' },
  { id: 5, name: 'cardio' },
  { id: 6, name: 'core' },
  { id: 7, name: 'tren-superior' },
  { id: 8, name: 'tren-inferior' },
  { id: 9, name: 'agarre' },
  { id: 10, name: 'ocr' }
];

export const SEED_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Press de Banca',
    description: 'Ejercicio de press con barra',
    muscleGroups: [SEED_MUSCLE_GROUPS[0], SEED_MUSCLE_GROUPS[4]], 
    type: ExerciseType.REPS,
    hasVariations: false,
    tags: ['fuerza', 'tren-superior']
  },
  {
    id: 'ex-2',
    name: 'Sentadillas',
    description: 'Ejercicio de piernas clásico',
    muscleGroups: [SEED_MUSCLE_GROUPS[2], SEED_MUSCLE_GROUPS[3]],
    type: ExerciseType.REPS,
    hasVariations: false,
    tags: ['fuerza', 'tren-inferior']
  },
  {
    id: 'ex-3',
    name: 'Zancadas Búlgaras',
    description: 'Sentadilla a una pierna con apoyo trasero',
    muscleGroups: [SEED_MUSCLE_GROUPS[2]],
    type: ExerciseType.REPS,
    hasVariations: true, // Izquierda y Derecha
    tags: ['fuerza', 'equilibrio', 'tren-inferior']
  },
  {
    id: 'ex-4',
    name: 'Plancha',
    description: 'Ejercicio isométrico de abdomen',
    muscleGroups: [SEED_MUSCLE_GROUPS[5], SEED_MUSCLE_GROUPS[6]],
    type: ExerciseType.TIME,
    hasVariations: false,
    tags: ['resistencia', 'core']
  },
  {
    id: 'ex-5',
    name: 'Remo con Barra',
    description: 'Tracción horizontal',
    muscleGroups: [SEED_MUSCLE_GROUPS[1]],
    type: ExerciseType.REPS,
    hasVariations: false,
    tags: ['fuerza', 'tren-superior']
  },
  {
    id: 'ex-6',
    name: 'Suspensión en Regleta (Dead Hang)',
    description: 'Aguante isométrico para fuerza de dedos',
    muscleGroups: [SEED_MUSCLE_GROUPS[7], SEED_MUSCLE_GROUPS[1]],
    type: ExerciseType.TIME,
    hasVariations: false,
    tags: ['agarre', 'ocr', 'fuerza']
  }
];

export const SEED_WORKOUTS: Workout[] = [
  {
    id: 'wk-1',
    name: 'Upper Body Básico',
    description: 'Entrenamiento de tren superior',
    tags: [SEED_TAGS[0], SEED_TAGS[6]],
    blocks: [
      {
        id: 'blk-1-1',
        rounds: 3, // Repetir este bloque 3 veces
        restBetweenRounds: 120, // 2 minutos al acabar la vuelta
        exercises: [
          {
            id: 'inst-1',
            exercise: SEED_EXERCISES[0], // Press de Banca
            targetValue: 10,
            weight: 60
          },
          {
            id: 'inst-2',
            exercise: SEED_EXERCISES[4], // Remo
            targetValue: 10,
            weight: 50
          }
        ],
        restBetweenExercises: 90
      }
    ]
  },
  {
    id: 'wk-2',
    name: 'Fuerza de Agarre y Piernas',
    description: 'Preparación específica con isométricos y unilaterales',
    tags: [SEED_TAGS[0], SEED_TAGS[8], SEED_TAGS[9]],
    blocks: [
      {
        id: 'blk-2-1',
        rounds: 4,
        restBetweenRounds: 60,
        exercises: [
          {
            id: 'inst-3',
            exercise: SEED_EXERCISES[5], // Suspensión en Regleta
            targetValue: 30, // 30 segundos
            weight: 0
          },
          {
            id: 'inst-4',
            exercise: SEED_EXERCISES[2], // Zancadas Búlgaras (Generará paso Izq y Der)
            targetValue: 8, // 8 reps por pierna
            weight: 16 // 16kg de lastre (ej. kettlebell)
          }
        ],
        restBetweenExercises: 45
      }
    ]
  }
];

const SEED_WORKOUT_HISTORY: HistoryRecord[] = [
{
    id: 'hist-1',
    workoutId: 'wk-1',
    workoutName: 'Upper Body Básico',
    date: new Date('2026-04-15T18:30:00'),
    durationInSeconds: 2700, // 45 minutos
    notes: ''
  },
  {
    id: 'hist-2',
    workoutId: 'wk-2',
    workoutName: 'Fuerza de Agarre y Piernas',
    date: new Date('2026-04-17T19:00:00'),
    durationInSeconds: 3200,
    notes: ''
  },
  {
    id: 'hist-3',
    workoutId: 'wk-1',
    workoutName: 'Upper Body Básico',
    date: new Date('2026-04-20T17:45:00'),
    durationInSeconds: 2500,
    notes: ''
  },
  {
    id: 'hist-4',
    workoutId: 'wk-2',
    workoutName: 'Fuerza de Agarre y Piernas',
    date: new Date('2026-04-22T18:15:00'),
    durationInSeconds: 3000,
    notes: ''
  },
  {
    id: 'hist-5',
    workoutId: 'wk-1',
    workoutName: 'Upper Body Básico',
    date: new Date('2026-04-25T19:30:00'),
    durationInSeconds: 2800,
    notes: ''
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

  // History Records
  getAllHistoryRecords(): HistoryRecord[] {
    return SEED_WORKOUT_HISTORY;
  }

  getHistoryRecordByWorkoutId(workoutId: string): HistoryRecord | undefined {
    const history: HistoryRecord | undefined = SEED_WORKOUT_HISTORY.find(record => record.workoutId === workoutId);
    return history;
  }

  getLastHistoryRecords(count: number): HistoryRecord[] {
    const sortedHistory = [...SEED_WORKOUT_HISTORY].sort((a, b) => b.date.getTime() - a.date.getTime());
    return sortedHistory.slice(0, count);
  }
}