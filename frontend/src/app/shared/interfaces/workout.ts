import { WorkoutBlock } from "./workout-block";
import { WorkoutTag } from "./workout-tag";

export interface Workout {
  id: string;
  name: string;
  description: string;
  tags: WorkoutTag[];
  blocks: WorkoutBlock[];
}

export interface WorkoutInput {
  name: string;
  description: string;
  tags: WorkoutTag[];
  blocks: {
    rounds: number;
    restBetweenRounds: number;
    restBetweenExercises: number;
    restAfterBlock: number;
    exercises: {
      exercise: { id: string };
      targetValue: number;
      weight?: number | null;
    }[];
  }[];
}
