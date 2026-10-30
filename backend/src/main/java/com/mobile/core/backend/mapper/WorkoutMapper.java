package com.mobile.core.backend.mapper;

import com.mobile.core.backend.dto.ExerciseInstanceDTO;
import com.mobile.core.backend.dto.WorkoutBlockDTO;
import com.mobile.core.backend.dto.WorkoutDTO;
import com.mobile.core.backend.model.ExerciseInstance;
import com.mobile.core.backend.model.Workout;
import com.mobile.core.backend.model.WorkoutBlock;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class WorkoutMapper {
    private final ExerciseMapper exerciseMapper;
    private final WorkoutTagMapper workoutTagMapper;

    public WorkoutDTO toDto(Workout entity) {
        WorkoutDTO dto = new WorkoutDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setTags(workoutTagMapper.mapTagsToDto(entity.getTags()));

        if (entity.getBlocks() == null || entity.getBlocks().isEmpty()) {
            dto.setBlocks(List.of());
            return dto;
        }

        dto.setBlocks(entity.getBlocks().stream()
                .filter(java.util.Objects::nonNull)
                .map(this::toDto)
                .toList());
        return dto;
    }

    private WorkoutBlockDTO toDto(WorkoutBlock entity) {
        WorkoutBlockDTO dto = new WorkoutBlockDTO();
        dto.setId(entity.getId());
        dto.setRounds(entity.getRounds());
        dto.setRestBetweenRounds(entity.getRestBetweenRounds());
        dto.setRestBetweenExercises(entity.getRestBetweenExercises());
        dto.setRestAfterBlock(entity.getRestAfterBlock());

        if (entity.getExercises() == null || entity.getExercises().isEmpty()) {
            dto.setExercises(List.of());
            return dto;
        }

        dto.setExercises(entity.getExercises().stream()
                .filter(java.util.Objects::nonNull)
                .map(this::toDto)
                .toList());
        return dto;
    }

    private ExerciseInstanceDTO toDto(ExerciseInstance entity) {
        ExerciseInstanceDTO dto = new ExerciseInstanceDTO();
        dto.setId(entity.getId());
        dto.setExercise(exerciseMapper.toDto(entity.getExercise()));
        dto.setTargetValue(entity.getTargetValue());
        dto.setWeight(entity.getWeight());
        return dto;
    }
}
