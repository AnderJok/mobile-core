package com.mobile.core.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "exercise_instances")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ExerciseInstance {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

    private Integer targetValue;
    private Double weight;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_block_id")
    private WorkoutBlock workoutBlock;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    @Column(name = "deleted_at")
    private Date deletedAt;
}