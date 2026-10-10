import { Component } from '@angular/core';
import { ExerciseBuilder } from '../../components/exercise-builder/exercise-builder';
import { ExerciseList } from '../../components/exercise-list/exercise-list';
import { ExerciseFilter } from '../../components/exercise-filter/exercise-filter';

@Component({
  selector: 'app-exercises',
  imports: [ExerciseBuilder, ExerciseFilter, ExerciseList],
  templateUrl: './exercises.html',
  styleUrl: './exercises.css',
})
export class Exercises {}
