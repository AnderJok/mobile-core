import { WorkoutBlock } from "./workout-block";

export interface Workout {
  id: string;
  name: string;
  description: string;
  tags: string[];
  blocks: WorkoutBlock[];
}
