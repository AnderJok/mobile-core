package com.mobile.core.backend.service;

import com.mobile.core.backend.dto.ExerciseDTO;
import com.mobile.core.backend.dto.WorkoutDTO;
import com.mobile.core.backend.mapper.ExerciseMapper;
import com.mobile.core.backend.model.Exercise;
import com.mobile.core.backend.model.Workout;
import com.mobile.core.backend.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExerciseService {
    private final ExerciseRepository exerciseRepository;

    private final ExerciseMapper exerciseMapper;

    @Transactional(readOnly = true)
    public List<ExerciseDTO> getAllExercises() {
        return exerciseRepository.findAllActiveExercises().stream()
                .map(exerciseMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ExerciseDTO getExerciseById(UUID id) {
        return exerciseRepository.findById(id)
                .map(exerciseMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));
    }

    @Transactional
    public ExerciseDTO createExercise(ExerciseDTO exerciseDTO) {
        Exercise exercise = exerciseMapper.toEntity(exerciseDTO);
        exercise.setCreatedAt(new java.util.Date());
        Exercise saved = exerciseRepository.save(exercise);
        return exerciseMapper.toDto(saved);
    }

    @Transactional
    public ExerciseDTO updateExercise(UUID id, ExerciseDTO exerciseDTO) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));
        exercise.setName(exerciseDTO.getName());
        exercise.setDescription(exerciseDTO.getDescription());
        exercise.setType(exerciseDTO.getType());
        exercise.setHasVariations(exerciseDTO.isHasVariations());
        exercise.setDefaultValue(exerciseDTO.getDefaultValue());
        exercise.setTags(exerciseDTO.getTags());
        exercise.setUpdatedAt(new java.util.Date());
        return exerciseMapper.toDto(exerciseRepository.save(exercise));
    }

    @Transactional
    public void deleteExercise(UUID id) {
        if (!exerciseRepository.existsById(id)) {
            throw new RuntimeException("Exercise not found");
        }
        Exercise exercise = exerciseRepository.findById(id).orElseThrow(() -> new RuntimeException("Exercise not found"));
        exercise.setDeletedAt(new java.util.Date());
        exerciseRepository.save(exercise);
    }
}
