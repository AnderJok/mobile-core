import { ExerciseInstance } from "./exercise-instance";

export type StepType = 'EXERCISE' | 'REST' | 'PREPARE';

export interface ActiveStep {
  id: string;
  type: StepType;
  name: string;
  valueType: 'TIME' | 'REPS';
  weight?: number;
  targetValue: number; // target countdown seconds (if TIME/REST) or reps goal (if REPS)
  side: 'L' | 'R' | 'NONE';
  
  description: string;
  blockIndex: number;
  roundIndex: number;
  exerciseIndex: number;

  exerciseInstanceId?: ExerciseInstance;
}