import { ExerciseInstance } from "./exercise-instance";

export interface WorkoutBlock {
  id: string;
  exercises: ExerciseInstance[];
  restBetweenExercises: number;
  restAfterBlock: number;
}