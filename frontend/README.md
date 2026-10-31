# mobile-core
An app to create, manage, and train your personal workouts

## Workout CRUD

- Open `/workouts` to list saved workouts, view their details, edit them, or
  delete them. Deletion is logical, as with exercises.
- `/workout-builder` creates a workout; `/workout-builder/:id` edits one fetched
  from the backend, including when the URL is opened directly.
- A workout needs a name, at least one block, and at least one exercise per
  block. Add, remove, and reorder blocks and exercise occurrences independently.
- Each block has positive integer rounds and non-negative integer rests
  (seconds) between exercises, between rounds, and after the block.
  `restAfterBlock` applies before the next block, never after the last block.
- Exercise targets are positive integers: repetitions for `REPS`, seconds for
  `TIME`. Weight is optional and non-negative (kg). Exercise definitions are
  referenced by id, not created or modified by the workout form.
- Select existing tags or create a new tag in the form. Tags are shared and
  remain available after deleting a workout.
- Training history is not implemented by this CRUD.

## Workout player

- Start a saved workout from the list. The global player and active workout page
  show the current exercise or rest, target reps/seconds, weight, block and round.
- NEXT advances manually, including through timed exercises and rests; there is
  no automatic countdown. Pause/resume preserves the current step, and NEXT
  remains available while paused without resuming playback.
- Each round visits the block's exercises in their saved order. Exercises with
  variations have consecutive left/right steps, without an extra rest between sides.
- Positive rests are inserted between exercises, between rounds, and between
  blocks (`restAfterBlock`), not accumulated at the same boundary. Zero rests
  are skipped, and there is no rest after the final exercise of the workout.
- NEXT on the last step finishes the session and returns home. STOP clears the
  session; starting another workout resets progress. Playback is in memory only
  and does not create a history record.

### Backend and existing PostgreSQL databases

The backend uses Java 21 and the PostgreSQL connection configured in
[application.properties](../backend/src/main/resources/application.properties).
Hibernate creates the schema for an empty database (`ddl-auto=update`).

**For an existing database**, back it up, stop the backend, and execute
[workout-crud-upgrade.sql](../backend/src/main/resources/db/workout-crud-upgrade.sql)
before starting the updated backend. The script backfills ordering columns and
the new `rest_after_block` column; Hibernate then creates the tag join table.
The old schema did not store ordering, so its original sequence cannot be
recovered: the script uses existing positions, then creation time and id.
Review old workouts in the editor and reorder them if necessary.
The script is manual; no automatic migration runner is configured.

API endpoints:

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/workouts` | List non-deleted workouts |
| GET | `/workouts/{id}` | Read a non-deleted workout |
| POST | `/workouts` | Create a workout with ordered blocks and exercises |
| PUT | `/workouts/{id}` | Replace workout content |
| DELETE | `/workouts/{id}` | Soft-delete a workout |
| GET | `/workout-tags` | List available tags |
| POST | `/workout-tags` | Create a tag, or return the existing exact name |

Nested blocks and exercise occurrences are replaced on edit; their ids are
server-generated. Existing exercise and tag ids are resolved and validated.
Archived exercises can be retained when editing an existing workout but cannot
be added to a new workout. Missing workouts return 404; invalid input or
references return 400.

### Verification

From `backend`, run `.\mvnw.cmd test`. Tests use an isolated H2 database in
PostgreSQL compatibility mode, not the configured PostgreSQL database.

From `frontend`, install dependencies with `npm install`, then run:

```text
npm run build
npm test -- --watch=false --include="src/app/services/workout.service.spec.ts" --include="src/app/features/workout/**/*.spec.ts"
```
