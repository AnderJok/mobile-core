package com.mobile.core.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class WorkoutDTO {
    private UUID id;

    @NotBlank(message = "Workout name is required")
    @Size(max = 255)
    private String name;

    @Size(max = 255)
    private String description;

    @Valid
    private List<@NotNull WorkoutTagDTO> tags;

    @Valid
    @NotEmpty
    private List<@NotNull WorkoutBlockDTO> blocks;
}
