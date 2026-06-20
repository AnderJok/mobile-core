import { WorkoutBlock } from "./workout-block";
import { WorkoutTag } from "./workout-tag";

export interface Workout {
  id: string;
  name: string;
  description: string;
  tags: WorkoutTag[];
  blocks: WorkoutBlock[];
}
