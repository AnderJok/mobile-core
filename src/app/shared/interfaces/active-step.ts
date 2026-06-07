import { ExerciseInstance } from "./exercise-instance";

export interface ActiveStep {
  id: string;
  type: 'EXERCISE' | 'REST';
  exerciseInstance?: ExerciseInstance;
  side: 'L' | 'R' | 'NONE';
  name: string;
  description: string;
  valueType: 'TIME' | 'REPS' | 'REST';
  targetValue: number; // target countdown seconds (if TIME/REST) or reps goal (if REPS)
  weight?: number;
  blockIndex: number;
}
