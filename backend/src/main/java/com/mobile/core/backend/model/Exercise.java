package com.mobile.core.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "exercises")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkoutEnums.ExerciseType type;

    @Column(name = "has_variations", nullable = false)
    private boolean hasVariations;

    @Column(name = "default_value")
    private Integer defaultValue;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "exercise_tags", joinColumns = @JoinColumn(name = "exercise_id"))
    @Column(name = "tag")
    private List<String> tags;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    @Column(name = "deleted_at")
    private Date deletedAt;
}