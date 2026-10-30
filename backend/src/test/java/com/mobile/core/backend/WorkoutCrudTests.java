package com.mobile.core.backend;

import com.mobile.core.backend.dto.*;
import com.mobile.core.backend.model.*;
import com.mobile.core.backend.repository.*;
import com.mobile.core.backend.service.WorkoutService;
import jakarta.persistence.EntityManager;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class WorkoutCrudTests {
    @Autowired WorkoutService service;
    @Autowired ExerciseRepository exercises;
    @Autowired WorkoutRepository workouts;
    @Autowired WorkoutTagRepository tags;
    @Autowired EntityManager entityManager;
    @Autowired Validator validator;
    @Autowired MockMvc mvc;

    @Test
    void persistsOrderedGraphUpdatesAndSoftDeletesWithoutChangingExercisesOrTags() {
        Exercise reps = exercise("Squats", WorkoutEnums.ExerciseType.REPS);
        Exercise time = exercise("Plank", WorkoutEnums.ExerciseType.TIME);
        WorkoutTag tag = tags.save(WorkoutTag.builder().name("Strength").build());
        WorkoutDTO input = input(reps, time);
        input.setTags(List.of(new WorkoutTagDTO(tag.getId(), tag.getName())));
        WorkoutDTO created = service.createWorkout(input);
        UUID id = created.getId();
        reload();

        WorkoutDTO saved = service.getWorkoutById(id);
        assertThat(saved.getBlocks()).hasSize(2);
        assertThat(saved.getBlocks().getFirst().getExercises())
                .extracting(instance -> instance.getExercise().getId()).containsExactly(time.getId(), reps.getId());
        assertThat(saved.getBlocks().getFirst().getExercises().getFirst().getExercise().getType())
                .isEqualTo(WorkoutEnums.ExerciseType.TIME);
        assertThat(saved.getBlocks().getFirst().getRestAfterBlock()).isEqualTo(45);
        assertThat(saved.getTags()).extracting(WorkoutTagDTO::getId).containsExactly(tag.getId());

        saved.setBlocks(new ArrayList<>(saved.getBlocks()));
        Collections.reverse(saved.getBlocks());
        saved.setName("Updated workout");
        saved.setTags(List.of());
        saved.getBlocks().removeLast();
        saved.getBlocks().getFirst().setExercises(List.of(instance(reps, 15)));
        service.updateWorkout(id, saved);
        reload();

        WorkoutDTO updated = service.getWorkoutById(id);
        assertThat(updated.getName()).isEqualTo("Updated workout");
        assertThat(updated.getTags()).isEmpty();
        assertThat(updated.getBlocks()).hasSize(1);
        assertThat(updated.getBlocks().getFirst().getExercises().getFirst().getTargetValue()).isEqualTo(15);
        assertThat(entityManager.createQuery("select count(b) from WorkoutBlock b", Long.class).getSingleResult()).isEqualTo(1);
        assertThat(entityManager.createQuery("select count(e) from ExerciseInstance e", Long.class).getSingleResult()).isEqualTo(1);

        service.deleteWorkout(id);
        reload();
        assertThat(service.getAllWorkouts()).isEmpty();
        assertThatThrownBy(() -> service.getWorkoutById(id)).isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("404");
        assertThat(workouts.findById(id).orElseThrow().getDeletedAt()).isNotNull();
        assertThat(exercises.count()).isEqualTo(2);
        assertThat(tags.existsById(tag.getId())).isTrue();
    }

    @Test
    void preservesBlockAndExerciseReorderingAfterReload() {
        Exercise first = exercise("First", WorkoutEnums.ExerciseType.REPS);
        Exercise second = exercise("Second", WorkoutEnums.ExerciseType.TIME);
        WorkoutDTO created = service.createWorkout(input(first, second));
        reload();
        WorkoutDTO loaded = service.getWorkoutById(created.getId());
        loaded.setBlocks(new ArrayList<>(loaded.getBlocks()));
        Collections.reverse(loaded.getBlocks());
        var reordered = new ArrayList<>(loaded.getBlocks().getLast().getExercises());
        Collections.reverse(reordered);
        loaded.getBlocks().getLast().setExercises(reordered);
        service.updateWorkout(created.getId(), loaded);
        reload();
        var result = service.getWorkoutById(created.getId()).getBlocks();
        assertThat(result.getFirst().getRestAfterBlock()).isZero();
        assertThat(result.getLast().getRestAfterBlock()).isEqualTo(45);
        assertThat(result.getLast().getExercises()).extracting(i -> i.getExercise().getId())
                .containsExactly(first.getId(), second.getId());
    }

    @Test
    void rejectsMissingOrDeletedReferencesButAllowsExistingArchivedExerciseOnEdit() {
        Exercise exercise = exercise("Archived", WorkoutEnums.ExerciseType.REPS);
        WorkoutDTO input = input(exercise, exercise);
        WorkoutDTO created = service.createWorkout(input);
        exercise.setDeletedAt(new Date());
        exercises.save(exercise);
        service.updateWorkout(created.getId(), input);
        assertThatThrownBy(() -> service.createWorkout(input)).isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("400");
    }

    @Test
    void validatesNestedValues() {
        Exercise exercise = exercise("Validation", WorkoutEnums.ExerciseType.REPS);
        WorkoutDTO input = input(exercise, exercise);
        input.getBlocks().getFirst().setRounds(0);
        input.getBlocks().getFirst().setRestAfterBlock(-1);
        input.getBlocks().getFirst().getExercises().getFirst().setTargetValue(0);
        input.getBlocks().getFirst().getExercises().getFirst().setWeight(-1.0);
        assertThat(validator.validate(input)).hasSize(4);
        input.setBlocks(List.of());
        assertThat(validator.validate(input)).isNotEmpty();
    }

    @Test
    void exposesCrudRoutesAndRejectsInvalidPayloads() throws Exception {
        Exercise exercise = exercise("HTTP", WorkoutEnums.ExerciseType.REPS);
        String json = """
                {"name":"HTTP workout","tags":[],"blocks":[{"rounds":2,"restAfterBlock":30,
                "exercises":[{"exercise":{"id":"%s"},"targetValue":10}]}]}
                """.formatted(exercise.getId());
        mvc.perform(post("/workouts").contentType("application/json").content(json))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.blocks[0].restAfterBlock").value(30))
                .andExpect(jsonPath("$.blocks[0].exercises[0].exercise.type").value("REPS"));
        UUID id = workouts.findByDeletedAtIsNullOrderByCreatedAtDesc().getFirst().getId();
        mvc.perform(get("/workouts/" + id)).andExpect(status().isOk());
        mvc.perform(put("/workouts/" + id).contentType("application/json").content(json.replace("HTTP workout", "Edited")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.name").value("Edited"));
        mvc.perform(post("/workouts").contentType("application/json").content(json.replace("\"rounds\":2", "\"rounds\":0")))
                .andExpect(status().isBadRequest());
        mvc.perform(post("/workouts").contentType("application/json")
                .content(json.replace(exercise.getId().toString(), UUID.randomUUID().toString())))
                .andExpect(status().isBadRequest());
        mvc.perform(delete("/workouts/" + id)).andExpect(status().isNoContent());
        mvc.perform(get("/workouts/" + id)).andExpect(status().isNotFound());
        mvc.perform(put("/workouts/" + id).contentType("application/json").content(json)).andExpect(status().isNotFound());
        mvc.perform(delete("/workouts/" + id)).andExpect(status().isNotFound());
    }

    @Test
    void createsAndListsSelectableTagsWithoutDuplicates() throws Exception {
        String json = "{\"name\":\"  Mobility  \"}";
        mvc.perform(post("/workout-tags").contentType("application/json").content(json))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.name").value("Mobility"));
        mvc.perform(post("/workout-tags").contentType("application/json").content(json))
                .andExpect(status().isCreated());
        mvc.perform(get("/workout-tags")).andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
        mvc.perform(post("/workout-tags").contentType("application/json").content("{\"name\":\" \"}"))
                .andExpect(status().isBadRequest());
    }

    private Exercise exercise(String name, WorkoutEnums.ExerciseType type) {
        return exercises.save(Exercise.builder().name(name).type(type).tags(List.of("test")).build());
    }

    private WorkoutDTO input(Exercise first, Exercise second) {
        WorkoutDTO dto = new WorkoutDTO();
        dto.setName(" Workout ");
        WorkoutBlockDTO block = new WorkoutBlockDTO();
        block.setRounds(3);
        block.setRestBetweenExercises(15);
        block.setRestBetweenRounds(60);
        block.setRestAfterBlock(45);
        block.setExercises(new ArrayList<>(List.of(instance(second, 30), instance(first, 10))));
        WorkoutBlockDTO other = new WorkoutBlockDTO();
        other.setRounds(1);
        other.setExercises(List.of(instance(first, 12)));
        dto.setBlocks(new ArrayList<>(List.of(block, other)));
        return dto;
    }

    private ExerciseInstanceDTO instance(Exercise exercise, int target) {
        ExerciseDTO reference = new ExerciseDTO();
        reference.setId(exercise.getId());
        ExerciseInstanceDTO dto = new ExerciseInstanceDTO();
        dto.setExercise(reference);
        dto.setTargetValue(target);
        dto.setWeight(2.5);
        return dto;
    }

    private void reload() {
        entityManager.flush();
        entityManager.clear();
    }
}
