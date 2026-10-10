package com.mobile.core.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "workout_tags")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}