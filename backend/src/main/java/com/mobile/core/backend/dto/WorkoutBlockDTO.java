package com.mobile.core.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class WorkoutBlockDTO {

    private UUID id;

    @NotNull
    @Positive
    private Integer rounds;

    @NotNull
    @PositiveOrZero
    private Integer restBetweenRounds = 0;

    @Valid
    @NotEmpty
    private List<@NotNull ExerciseInstanceDTO> exercises;

    @NotNull
    @PositiveOrZero
    private Integer restBetweenExercises = 0;

    @NotNull
    @PositiveOrZero
    private Integer restAfterBlock = 0;
}
