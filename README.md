# Mobile Core

A web app to create, manage, and train your personal workouts.

Build workouts from blocks of exercises, set rounds and rest times, and
follow them step by step in a workout player.

## Features
- **Exercise management:** list, view, create, edit, and delete exercises.
- **Workout management:** list, view, create, edit, and delete workouts.
- **Workout builder:** organize blocks and exercises, with rounds, rests, and optional weights.
- **Tags:** label workouts with shared tags.
- **Workout player:** run a saved workout with the current exercise, target, and next step.

## Screenshots and demo

_Coming soon._

## Tech stack

- **Frontend:** Angular 21 (standalone components), TypeScript
- **Backend:** Java 21, Spring Boot 4, Spring Data JPA
- **Database:** PostgreSQL

## Getting started

### Prerequisites

- Node.js and npm
- Java 21
- PostgreSQL running on `localhost:5432`, with a database named `mobile-core`

### 1. Configure the database

Set the username and password in
[application.properties](backend/src/main/resources/application.properties)
to match your local PostgreSQL installation.

### 2. Start the backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The API runs on `http://localhost:8080`.

### 3. Start the frontend

```powershell
cd frontend
npm install
npm start
```

Open `http://localhost:4200` in your browser.

## Project structure

```text
backend/    Spring Boot API (controllers, services, repositories)
frontend/   Angular application
```