package com.mobile.core.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.util.UUID;

@Data
public class ExerciseInstanceDTO {
    private UUID id;

    @NotNull
    private ExerciseDTO exercise;

    @NotNull
    @Positive
    private Integer targetValue;

    @PositiveOrZero
    private Double weight;
}
