import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-history-graph',
  imports: [MatFormFieldModule, MatSelectModule, MatIconModule],
  templateUrl: './history-graph.html',
  styleUrl: './history-graph.css',
})
export class HistoryGraph {}
