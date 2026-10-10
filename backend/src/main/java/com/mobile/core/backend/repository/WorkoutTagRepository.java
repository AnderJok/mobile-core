package com.mobile.core.backend.repository;

import com.mobile.core.backend.model.WorkoutTag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutTagRepository extends JpaRepository<WorkoutTag, Long> {
}