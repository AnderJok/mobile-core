import { ExerciseType } from "./exercise-type";

export interface Exercise {
  id?: string;
  name: string;
  description: string;
  type: ExerciseType;
  hasVariations: boolean;
  defaultValue?: number; 
  tags: string[];
}