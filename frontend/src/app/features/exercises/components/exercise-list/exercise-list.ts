import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ExerciseService } from '../../../../services/exercise.service';
import type { Exercise } from '../../../../shared/interfaces/exercise';

@Component({
  selector: 'app-exercise-list',
  imports: [],
  templateUrl: './exercise-list.html',
  styleUrl: './exercise-list.css',
})  
export class ExerciseList {
    readonly exerciseService = inject(ExerciseService);
  @Output() readonly editRequested = new EventEmitter<Exercise>();

    deleteExercise(exercise: Exercise) {
      if (!exercise?.id) {
        console.error('Invalid exercise id');
        return;
      }
      this.exerciseService.deleteExerciseById(exercise?.id).subscribe({
        next: () => {
          console.log('Exercise deleted successfully');
        },
        error: (err) => {
          console.error('Failed to delete exercise:', err);
        }
      });
    }

    editExercise(exercise: Exercise) {
      this.editRequested.emit(exercise);
    }
}
