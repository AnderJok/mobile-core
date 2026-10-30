package com.mobile.core.backend.service;

import com.mobile.core.backend.dto.WorkoutDTO;
import com.mobile.core.backend.mapper.WorkoutMapper;
import com.mobile.core.backend.model.*;
import com.mobile.core.backend.repository.ExerciseRepository;
import com.mobile.core.backend.repository.WorkoutRepository;
import com.mobile.core.backend.repository.WorkoutTagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutService {
    private final WorkoutRepository workoutRepository;
    private final WorkoutMapper workoutMapper;
    private final ExerciseRepository exerciseRepository;
    private final WorkoutTagRepository workoutTagRepository;

    @Transactional(readOnly = true)
    public List<WorkoutDTO> getAllWorkouts() {
        return workoutRepository.findByDeletedAtIsNullOrderByCreatedAtDesc().stream()
                .map(workoutMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public WorkoutDTO getWorkoutById(UUID id) {
        return workoutMapper.toDto(findWorkout(id));
    }

    @Transactional
    public WorkoutDTO createWorkout(WorkoutDTO dto) {
        Workout workout = new Workout();
        workout.setBlocks(new ArrayList<>());
        workout.setCreatedAt(new Date());
        applyChanges(workout, dto);
        return workoutMapper.toDto(workoutRepository.save(workout));
    }

    @Transactional
    public WorkoutDTO updateWorkout(UUID id, WorkoutDTO dto) {
        Workout workout = findWorkout(id);
        applyChanges(workout, dto);
        workout.setUpdatedAt(new Date());
        return workoutMapper.toDto(workoutRepository.save(workout));
    }

    @Transactional
    public void deleteWorkout(UUID id) {
        Workout workout = findWorkout(id);
        workout.setDeletedAt(new Date());
        workoutRepository.save(workout);
    }

    private Workout findWorkout(UUID id) {
        return workoutRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));
    }

    private void applyChanges(Workout workout, WorkoutDTO dto) {
        Set<UUID> previousExerciseIds = workout.getBlocks().stream()
                .flatMap(block -> block.getExercises().stream())
                .map(instance -> instance.getExercise().getId()).collect(Collectors.toSet());
        Set<UUID> exerciseIds = dto.getBlocks().stream()
                .flatMap(block -> block.getExercises().stream())
                .map(instance -> instance.getExercise().getId()).collect(Collectors.toSet());
        if (exerciseIds.contains(null)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Exercise id is required");
        }
        Map<UUID, Exercise> exercises = exerciseRepository.findAllById(exerciseIds).stream()
                .filter(exercise -> exercise.getDeletedAt() == null || previousExerciseIds.contains(exercise.getId()))
                .collect(Collectors.toMap(Exercise::getId, Function.identity()));
        if (exercises.size() != exerciseIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "An exercise does not exist or has been deleted");
        }

        List<Long> tagIds = dto.getTags() == null ? List.of() : dto.getTags().stream()
                .map(tag -> tag.getId()).distinct().toList();
        if (tagIds.stream().anyMatch(Objects::isNull)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tag id is required");
        }
        List<WorkoutTag> tags = workoutTagRepository.findAllById(tagIds);
        if (tags.size() != tagIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A workout tag does not exist");
        }

        Date now = new Date();
        List<WorkoutBlock> blocks = new ArrayList<>();
        for (var blockDto : dto.getBlocks()) {
            WorkoutBlock block = new WorkoutBlock();
            block.setWorkout(workout);
            block.setRounds(blockDto.getRounds());
            block.setRestBetweenRounds(blockDto.getRestBetweenRounds());
            block.setRestBetweenExercises(blockDto.getRestBetweenExercises());
            block.setRestAfterBlock(blockDto.getRestAfterBlock());
            block.setCreatedAt(now);
            List<ExerciseInstance> instances = new ArrayList<>();
            for (var instanceDto : blockDto.getExercises()) {
                if (instanceDto.getWeight() != null && !Double.isFinite(instanceDto.getWeight())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Weight must be finite");
                }
                ExerciseInstance instance = new ExerciseInstance();
                instance.setWorkoutBlock(block);
                instance.setExercise(exercises.get(instanceDto.getExercise().getId()));
                instance.setTargetValue(instanceDto.getTargetValue());
                instance.setWeight(instanceDto.getWeight());
                instance.setCreatedAt(now);
                instances.add(instance);
            }
            block.setExercises(instances);
            blocks.add(block);
        }
        workout.setName(dto.getName().trim());
        workout.setDescription(dto.getDescription());
        workout.setTags(new ArrayList<>(tags));
        workout.getBlocks().clear();
        workout.getBlocks().addAll(blocks);
    }
}
