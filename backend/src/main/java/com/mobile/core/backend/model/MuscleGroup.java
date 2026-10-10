package com.mobile.core.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "muscle_groups")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class MuscleGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}