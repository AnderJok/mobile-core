import { ExerciseType } from "./exercise-type";
import { MuscleGroup } from "./muscle-group";

export interface Exercise {
  id?: string;
  name: string;
  description: string;
  type: ExerciseType;
  hasVariations: boolean;
  defaultValue?: number; 
  tags: string[];
}