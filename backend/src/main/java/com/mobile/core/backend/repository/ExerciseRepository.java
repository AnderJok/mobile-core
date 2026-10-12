package com.mobile.core.backend.repository;

import com.mobile.core.backend.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, UUID> {
    @Query("SELECT e FROM Exercise e WHERE e.deletedAt IS NULL")
    List<Exercise> findAllActiveExercises();
}