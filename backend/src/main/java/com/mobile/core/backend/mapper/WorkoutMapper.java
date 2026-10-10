package com.mobile.core.backend.mapper;

import com.mobile.core.backend.dto.ExerciseDTO;
import com.mobile.core.backend.dto.ExerciseInstanceDTO;
import com.mobile.core.backend.dto.WorkoutBlockDTO;
import com.mobile.core.backend.dto.WorkoutDTO;
import com.mobile.core.backend.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class WorkoutMapper {

    private final WorkoutTagMapper workoutTagMapper;

    public WorkoutDTO toDto(Workout entity) {
        if (entity == null) return null;
        WorkoutDTO dto = new WorkoutDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setTags(workoutTagMapper.mapTagsToDto(entity.getTags()));
        dto.setBlocks(mapBlocksToDto(entity.getBlocks()));
        return dto;
    }

    public Workout toEntity(WorkoutDTO dto) {
        if (dto == null) return null;
        Workout workout = new Workout();
        workout.setId(dto.getId());
        workout.setName(dto.getName());
        workout.setDescription(dto.getDescription());
        workout.setTags(workoutTagMapper.mapTagsToEntity(dto.getTags()));
        workout.setBlocks(mapBlocksToEntity(dto.getBlocks()));
        return workout;
    }

    // --- Workout Block Mapping ---
    private List<WorkoutBlockDTO> mapBlocksToDto(List<WorkoutBlock> blocks) {
        if (blocks == null) return Collections.emptyList();
        return blocks.stream().map(this::toDto).toList();
    }

    private List<WorkoutBlock> mapBlocksToEntity(List<WorkoutBlockDTO> dtos) {
        if (dtos == null) return Collections.emptyList();
        return dtos.stream().map(this::toEntity).toList();
    }

    private WorkoutBlockDTO toDto(WorkoutBlock entity) {
        if (entity == null) return null;
        WorkoutBlockDTO dto = new WorkoutBlockDTO();
        dto.setId(entity.getId());
        dto.setRounds(entity.getRounds());
        dto.setRestBetweenRounds(entity.getRestBetweenRounds());
        dto.setExercises(mapInstancesToDto(entity.getExercises()));
        dto.setRestBetweenExercises(entity.getRestBetweenExercises());
        return dto;
    }

    private WorkoutBlock toEntity(WorkoutBlockDTO dto) {
        if (dto == null) return null;
        WorkoutBlock block = new WorkoutBlock();
        block.setId(dto.getId());
        block.setRounds(dto.getRounds());
        block.setRestBetweenRounds(dto.getRestBetweenRounds());
        block.setExercises(mapInstancesToEntity(dto.getExercises()));
        block.setRestBetweenExercises(dto.getRestBetweenExercises());
        return block;
    }

    // --- Exercise Instance Mapping ---
    private List<ExerciseInstanceDTO> mapInstancesToDto(List<ExerciseInstance> instances) {
        if (instances == null) return Collections.emptyList();
        return instances.stream().map(this::toDto).toList();
    }

    private List<ExerciseInstance> mapInstancesToEntity(List<ExerciseInstanceDTO> dtos) {
        if (dtos == null) return Collections.emptyList();
        return dtos.stream().map(this::toEntity).toList();
    }

    private ExerciseInstanceDTO toDto(ExerciseInstance entity) {
        if (entity == null) return null;
        ExerciseInstanceDTO dto = new ExerciseInstanceDTO();
        dto.setId(entity.getId());
        dto.setExercise(toDto(entity.getExercise()));
        dto.setTargetValue(entity.getTargetValue());
        dto.setWeight(entity.getWeight());
        return dto;
    }

    private ExerciseInstance toEntity(ExerciseInstanceDTO dto) {
        if (dto == null) return null;
        ExerciseInstance instance = new ExerciseInstance();
        instance.setId(dto.getId());
        instance.setExercise(toEntity(dto.getExercise()));
        instance.setTargetValue(dto.getTargetValue());
        instance.setWeight(dto.getWeight());
        return instance;
    }

    // --- Exercise Mapping ---
    private ExerciseDTO toDto(Exercise entity) {
        if (entity == null) return null;
        ExerciseDTO dto = new ExerciseDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        return dto;
    }

    private Exercise toEntity(ExerciseDTO dto) {
        if (dto == null) return null;
        Exercise exercise = new Exercise();
        exercise.setId(dto.getId());
        exercise.setName(dto.getName());
        exercise.setDescription(dto.getDescription());
        return exercise;
    }


    // --- Tag Mapping ---



}
