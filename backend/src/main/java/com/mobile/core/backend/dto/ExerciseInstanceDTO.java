package com.mobile.core.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class ExerciseInstanceDTO {
    private UUID id;

    @NotNull
    private ExerciseDTO exercise;

    @NotNull
    private Integer targetValue;

    private Double weight;
}
