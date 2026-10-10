package com.mobile.core.backend.dto;

import com.mobile.core.backend.model.WorkoutEnums;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class ExerciseDTO {
    private UUID id;
    private String name;
    private String description;
    private List<MuscleGroupDTO> muscleGroups;
    private WorkoutEnums.ExerciseType type;
    private boolean hasVariations;
    private Integer defaultValue;
    private List<String> tags;
}
