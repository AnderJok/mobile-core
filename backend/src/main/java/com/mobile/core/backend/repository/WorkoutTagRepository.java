package com.mobile.core.backend.repository;

import com.mobile.core.backend.model.WorkoutTag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WorkoutTagRepository extends JpaRepository<WorkoutTag, Long> {
    Optional<WorkoutTag> findByName(String name);
}