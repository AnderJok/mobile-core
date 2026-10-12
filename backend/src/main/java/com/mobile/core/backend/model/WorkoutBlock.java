package com.mobile.core.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "workout_blocks")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkoutBlock {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private Integer rounds;
    private Integer restBetweenRounds;
    private Integer restBetweenExercises;

    @OneToMany(mappedBy = "workoutBlock", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExerciseInstance> exercises;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id")
    private Workout workout;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    @Column(name = "deleted_at")
    private Date deletedAt;
}