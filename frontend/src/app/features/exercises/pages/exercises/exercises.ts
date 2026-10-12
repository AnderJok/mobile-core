import { Component, signal } from '@angular/core';
import { ExerciseBuilder } from '../../components/exercise-builder/exercise-builder';
import { ExerciseList } from '../../components/exercise-list/exercise-list';
import { ExerciseFilter } from '../../components/exercise-filter/exercise-filter';
import { Exercise } from '../../../../shared/interfaces/exercise';

@Component({
  selector: 'app-exercises',
  imports: [ExerciseBuilder, ExerciseFilter, ExerciseList],
  templateUrl: './exercises.html',
  styleUrl: './exercises.css',
})
export class Exercises {
  readonly selectedExercise = signal<Exercise | null>(null);
}
