import { Pipe, PipeTransform } from '@angular/core';
import { formatElapsed } from '../utils/duration';

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
    transform(durationInSeconds: number): string {
        return formatElapsed(durationInSeconds);
    }
}