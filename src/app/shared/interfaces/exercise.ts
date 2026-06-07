import { ExerciseType } from "./exercise-type";
import { MuscleGroup } from "./muscle-group";

export interface Exercise {
  id: number;
  name: string;
  description: string;
  muscleGroup: MuscleGroup[];
  type: ExerciseType;
  hasVariations: boolean;
  defaultValue?: number; 
  tags: string[];
}