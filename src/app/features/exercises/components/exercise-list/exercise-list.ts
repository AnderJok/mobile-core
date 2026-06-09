import { Component, inject } from '@angular/core';
import { MockService } from '../../../../core/services/mock.service';

@Component({
  selector: 'app-exercise-list',
  imports: [],
  templateUrl: './exercise-list.html',
  styleUrl: './exercise-list.css',
})
export class ExerciseList {
    readonly mockService = inject(MockService);
}
