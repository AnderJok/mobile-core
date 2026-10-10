package com.mobile.core.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class WorkoutDTO {
    private UUID id;

    @NotBlank(message = "Workout name is required")
    private String name;

    private String description;

    private List<WorkoutTagDTO> tags;

    private List<WorkoutBlockDTO> blocks;
}
