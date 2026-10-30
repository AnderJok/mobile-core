package com.mobile.core.backend.repository;

import com.mobile.core.backend.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, UUID> {
    List<Workout> findByDeletedAtIsNullOrderByCreatedAtDesc();
    Optional<Workout> findByIdAndDeletedAtIsNull(UUID id);
}