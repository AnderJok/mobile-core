import { ExerciseType } from "./exercise-type";
import { MuscleGroup } from "./muscle-group";

export interface HistoryRecord {
  id: string;
  date: Date;
  workoutId: string;
}