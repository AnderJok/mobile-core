import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HistoryRecord } from '../shared/interfaces/history-record';
import { environment } from '../../environments/environments';

export interface HistoryRecordInput {
    workoutId: string;
    workoutName: string;
    date: string;
    durationInSeconds: number;
}

@Injectable({
    providedIn: 'root'
})
export class HistoryService {
    private http = inject(HttpClient);
    private historyRecordUrl = environment.apiUrl + 'history-records';

    historySignal = signal<HistoryRecord[]>([]);
    readonly historyRecords = this.historySignal.asReadonly();

    readonly loading = signal(false);
    readonly loadError = signal('');
    constructor() {
        this.getAllHistoryRecords();
    }

    getAllHistoryRecords() {
        this.loading.set(true);
        this.loadError.set('');
        return this.http.get<HistoryRecord[]>(this.historyRecordUrl).subscribe({
            next: historyRecords => {
                this.historySignal.set(historyRecords);
                this.loading.set(false);
            },
            error: error =>{
                console.error('Failed to load history records:', error);
                this.loadError.set('Could not load history records. Please retry');
                this.loading.set(false);
            }
        });
    }

    createHistoryRecord(record: HistoryRecordInput) {
        return this.http.post<HistoryRecord>(this.historyRecordUrl, record);
    }
}
