package com.mobile.core.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class WorkoutBlockDTO {

    private UUID id;

    @NotNull
    private Integer rounds;

    private Integer restBetweenRounds;

    private List<ExerciseInstanceDTO> exercises;

    private Integer restBetweenExercises;
}
