package com.mobile.core.backend.service;

import com.mobile.core.backend.dto.WorkoutDTO;
import com.mobile.core.backend.mapper.WorkoutMapper;
import com.mobile.core.backend.model.Workout;
import com.mobile.core.backend.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutRepository workoutRepository;

    private final WorkoutMapper workoutMapper;

    @Transactional(readOnly = true)
    public List<WorkoutDTO> getAllWorkouts() {
        return workoutRepository.findAll().stream()
                .map(workoutMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WorkoutDTO getWorkoutById(UUID id) {
        return workoutRepository.findById(id)
                .map(workoutMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Workout not found"));
    }

    @Transactional
    public WorkoutDTO createWorkout(WorkoutDTO workoutDTO) {
        Workout workout = workoutMapper.toEntity(workoutDTO);

        // Ensure bidirectional relationships are set before saving
        if (workout.getBlocks() != null) {
            workout.getBlocks().forEach(block -> {
                block.setWorkout(workout);
                if (block.getExercises() != null) {
                    block.getExercises().forEach(ex -> ex.setWorkoutBlock(block));
                }
            });
        }

        Workout saved = workoutRepository.save(workout);
        return workoutMapper.toDto(saved);
    }
}