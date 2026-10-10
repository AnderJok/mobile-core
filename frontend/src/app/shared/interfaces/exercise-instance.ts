import { Exercise } from "./exercise";

export interface ExerciseInstance {
  id: string;
  exercise: Exercise;
  targetValue: number; // Seconds (if TIME) or repetitions (if REPS)
  weight?: number; // Optional, for additional load or weights
}