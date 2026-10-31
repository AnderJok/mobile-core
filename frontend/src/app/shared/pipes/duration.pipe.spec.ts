import { DurationPipe } from './duration.pipe';

describe('DurationPipe', () => {
    const pipe = new DurationPipe();

    it('formats seconds as minutes and seconds', () => {
        expect(pipe.transform(0)).toBe('00:00');
        expect(pipe.transform(9)).toBe('00:09');
        expect(pipe.transform(65)).toBe('01:05');
        expect(pipe.transform(3600)).toBe('60:00');
    });

    it('discards fractional seconds and clamps negative durations to zero', () => {
        expect(pipe.transform(65.9)).toBe('01:05');
        expect(pipe.transform(-10)).toBe('00:00');
    });
});