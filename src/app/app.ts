import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mobile-core');

  activeScreen: string = 'home';
  showCelebrationModal: boolean = false;
  finishedWorkoutName: string = '';
  finishedElapsedSeconds: number = 0;

}
