package com.mobile.core.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "history_records")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class HistoryRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID workoutId;

    @Column(nullable = false)
    private String workoutName;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private Integer durationInSeconds;

    private String notes;
}