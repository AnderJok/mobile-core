package com.mobile.core.backend.mapper;

import com.mobile.core.backend.dto.ExerciseDTO;
import com.mobile.core.backend.model.Exercise;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ExerciseMapper {
    private final MuscleGroupMapper muscleGroupMapper;

    public ExerciseDTO toDto(Exercise entity) {
        if (entity == null) return null;
        ExerciseDTO dto = new ExerciseDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setMuscleGroups(muscleGroupMapper.mapMuscleGroupsToDto(entity.getMuscleGroups()));
        dto.setType(entity.getType());
        dto.setHasVariations(entity.isHasVariations());
        dto.setDefaultValue(entity.getDefaultValue());
        dto.setTags(entity.getTags());
        return dto;
    }

    public Exercise toEntity(ExerciseDTO dto) {
        if (dto == null) return null;
        Exercise exercise = new Exercise();
        exercise.setId(dto.getId());
        exercise.setName(dto.getName());
        exercise.setDescription(dto.getDescription());
        exercise.setMuscleGroups(muscleGroupMapper.mapMuscleGroupsToEntity(dto.getMuscleGroups()));
        exercise.setType(dto.getType());
        exercise.setHasVariations(dto.isHasVariations());
        exercise.setDefaultValue(dto.getDefaultValue());
        exercise.setTags(dto.getTags());
        return exercise;
    }
}
