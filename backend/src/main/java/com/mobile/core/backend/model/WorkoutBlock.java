package com.mobile.core.backend.model;

import jakarta.persistence.*;
import lombok.*;
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
}