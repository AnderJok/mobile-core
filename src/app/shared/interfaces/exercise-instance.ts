import { Exercise } from "./exercise";

export interface ExerciseInstance {
  exercise: Exercise;
  targetValue: number; // tiempo en segundos o número de repeticiones
  weight: number; // peso o lastre a utilizar (kg)
}