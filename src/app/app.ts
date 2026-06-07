import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './core/components/navbar/navbar';
import { GlobalPlayer } from './core/components/global-player/global-player';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, GlobalPlayer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mobile-core');
}
