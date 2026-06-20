export interface HistoryRecord {
  id: string;
  workoutId: string;
  workoutName: string;
  date: Date;
  durationInSeconds: number;
  notes?: string;
}