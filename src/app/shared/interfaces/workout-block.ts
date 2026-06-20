import { ExerciseInstance } from "./exercise-instance";

export interface WorkoutBlock {
  id: string;
  rounds: number;
  restBetweenRounds: number;
  exercises: ExerciseInstance[];
  restBetweenExercises: number;
}