import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { environment } from '../../../../../environments/environments';
import { Exercise } from '../../../../shared/interfaces/exercise';
import { ExerciseType } from '../../../../shared/interfaces/exercise-type';
import { Workout } from '../../../../shared/interfaces/workout';
import { WorkoutBuilder } from './workout-builder';

describe('WorkoutBuilder', () => {
    let fixture: ComponentFixture<WorkoutBuilder>;
    let component: WorkoutBuilder;
    let http: HttpTestingController;
    const url = environment.apiUrl;
    const exercise: Exercise = {
        id: 'exercise-1', name: 'Plank', description: '', type: ExerciseType.TIME,
        hasVariations: false, defaultValue: 30, tags: [],
    };
    const workout: Workout = {
        id: 'workout-1', name: 'Core', description: 'Core strength', tags: [{ id: 1, name: 'Strength' }],
        blocks: [{
            id: 'block-1', rounds: 3, restBetweenExercises: 15, restBetweenRounds: 60, restAfterBlock: 45,
            exercises: [{ id: 'instance-1', exercise, targetValue: 40, weight: 2.5 }],
        }],
    };

    function setup(id?: string, activeExercises = [exercise]) {
        TestBed.configureTestingModule({
            imports: [WorkoutBuilder],
            providers: [
                provideHttpClient(), provideHttpClientTesting(), provideRouter([]),
                { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap(id ? { id } : {}) } } },
            ],
        });
        fixture = TestBed.createComponent(WorkoutBuilder);
        component = fixture.componentInstance;
        http = TestBed.inject(HttpTestingController);
        http.expectOne(url + 'workouts').flush([]);
        http.expectOne(url + 'exercises').flush(activeExercises);
        http.expectOne(url + 'workout-tags').flush(workout.tags);
        vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
        fixture.detectChanges();
    }

    afterEach(() => http.verify());

    function validForm() {
        component.form.controls.name.setValue('  Core  ');
        component.blocks.at(0).controls.exercises.at(0).controls.exerciseId.setValue(exercise.id!);
    }

    it('renders and submits an ordered workout with rounds, rests and exercise references', () => {
        setup();
        validForm();
        component.form.controls.tags.setValue(workout.tags);
        component.blocks.at(0).controls.restAfterBlock.setValue(45);
        component.selectExercise(0, 0);
        expect(component.unit(exercise.id!)).toBe('seconds');
        expect(component.blocks.at(0).controls.exercises.at(0).controls.targetValue.value).toBe(30);
        component.addBlock();
        component.blocks.at(1).controls.exercises.at(0).controls.exerciseId.setValue(exercise.id!);
        component.move(component.blocks, component.blocks.at(1), -1);
        fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        const request = http.expectOne(url + 'workouts');
        expect(request.request.method).toBe('POST');
        expect(request.request.body.name).toBe('Core');
        expect(request.request.body.blocks.map((block: { restAfterBlock: number }) => block.restAfterBlock)).toEqual([0, 45]);
        expect(request.request.body.blocks[1].exercises[0]).toEqual({
            exercise: { id: exercise.id }, targetValue: 30, weight: null,
        });
        expect(component.saving()).toBe(true);
        component.saveWorkout();
        http.expectNone(url + 'workouts');
        request.flush(workout);
        expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/workouts']);
    });

    it('rejects invalid, empty and fractional values without sending HTTP requests', () => {
        setup();
        component.saveWorkout();
        expect(component.error()).toBeTruthy();
        validForm();
        const block = component.blocks.at(0);
        block.controls.rounds.setValue(1.5);
        expect(component.form.invalid).toBe(true);
        block.controls.rounds.setValue(1);
        block.controls.restAfterBlock.setValue(-1);
        expect(component.form.invalid).toBe(true);
        block.controls.restAfterBlock.setValue(0);
        block.controls.exercises.at(0).controls.targetValue.setValue(0);
        component.saveWorkout();
        http.expectNone(url + 'workouts');
        block.controls.exercises.clear();
        expect(component.form.invalid).toBe(true);
        component.blocks.clear();
        expect(component.form.invalid).toBe(true);
    });

    it('loads and updates an existing workout even when its exercise has been archived', () => {
        setup(workout.id, []);
        http.expectOne(url + 'workouts/' + workout.id).flush(workout);
        fixture.detectChanges();
        expect(component.form.controls.name.value).toBe('Core');
        expect(component.exercises()).toEqual([exercise]);
        expect(component.blocks.at(0).controls.restAfterBlock.value).toBe(45);
        component.form.controls.name.setValue('Edited');
        component.saveWorkout();
        const request = http.expectOne(url + 'workouts/' + workout.id);
        expect(request.request.method).toBe('PUT');
        expect(request.request.body.tags).toEqual(workout.tags);
        expect(request.request.body.blocks[0].exercises[0].weight).toBe(2.5);
        request.flush({ ...workout, name: 'Edited' });
    });

    it('keeps form data and displays an error when save fails, then allows retry', () => {
        setup();
        validForm();
        component.saveWorkout();
        http.expectOne(url + 'workouts').flush('Failed', { status: 500, statusText: 'Error' });
        expect(component.saving()).toBe(false);
        expect(component.form.enabled).toBe(true);
        expect(component.form.controls.name.value).toBe('  Core  ');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Could not save');
        component.saveWorkout();
        http.expectOne(url + 'workouts').flush(workout);
    });

    it('does not permit saving a workout whose initial load failed', () => {
        setup(workout.id);
        http.expectOne(url + 'workouts/' + workout.id).flush('Missing', { status: 404, statusText: 'Not Found' });
        component.saveWorkout();
        expect(component.form.disabled).toBe(true);
        expect(component.error()).toContain('Could not load');
        component.loadWorkout();
        http.expectOne(url + 'workouts/' + workout.id).flush(workout);
        expect(component.form.enabled).toBe(true);
    });

    it('creates a tag and selects the persisted result', () => {
        setup();
        component.newTag.setValue('  Mobility  ');
        component.createTag();
        const request = http.expectOne(url + 'workout-tags');
        expect(request.request.body).toEqual({ name: 'Mobility' });
        request.flush({ id: 2, name: 'Mobility' });
        expect(component.form.controls.tags.value).toEqual([{ id: 2, name: 'Mobility' }]);
        expect(component.availableTags()).toHaveLength(2);
    });

    it('preserves exercise control values when reordered or removed', () => {
        setup();
        component.addExercise(0);
        const instances = component.blocks.at(0).controls.exercises;
        instances.at(0).controls.targetValue.setValue(15);
        instances.at(1).controls.targetValue.setValue(20);
        component.move(instances, instances.at(1), -1);
        expect(instances.getRawValue().map(instance => instance.targetValue)).toEqual([20, 15]);
        instances.removeAt(1);
        expect(instances.at(0).controls.targetValue.value).toBe(20);
    });
});
