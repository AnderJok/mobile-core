package com.mobile.core.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class HistoryRecordDTO {
    private UUID id;

    @NotNull
    private UUID workoutId;

    @NotBlank
    private String workoutName;

    @NotNull
    private LocalDateTime date;

    @NotNull
    private Integer durationInSeconds;

    private String note;
}
