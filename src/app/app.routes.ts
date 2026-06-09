import { Routes } from '@angular/router';
import { activeWorkoutGuard } from './core/guards/active-workout.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        loadComponent: () => import('./features/home/pages/home/home').then((m) => m.Home),
    },
    {
        path: 'workouts',
        loadComponent: () => import('./features/workout/pages/workouts/workouts').then((m) => m.Workouts),
    },
    {
        path: 'active-workout/:id',
        canActivate: [activeWorkoutGuard],
        loadComponent: () => import('./features/workout/pages/active-workout/active-workout').then((m) => m.ActiveWorkout),
    },
    {
        path: 'workout-view/:id',
        loadComponent: () => import('./features/workout/pages/workout-view/workout-view').then((m) => m.WorkoutView),
    },
    {
        path: 'workout-builder',
        loadComponent: () => import('./features/workout/pages/workout-builder/workout-builder').then((m) => m.WorkoutBuilder),
    },
    {
        path: 'exercises',
        loadComponent: () => import('./features/exercises/pages/exercises/exercises').then((m) => m.Exercises),
    },
    {
        path: 'history',
        loadComponent: () => import('./features/history/pages/history/history').then((m) => m.History),
    },
    {
        path: 'profile',
        loadComponent: () => import('./features/user/profile/profile').then((m) => m.Profile),
    },
    {
        path: 'settings',
        loadComponent: () => import('./features/user/settings/settings').then((m) => m.Settings),
    },
    { path: '**', redirectTo: 'home' },
];
