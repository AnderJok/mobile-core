package com.mobile.core.backend.controller;

import com.mobile.core.backend.dto.ExerciseDTO;
import com.mobile.core.backend.service.ExerciseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/exercises")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200") // Angular default port
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping
    public ResponseEntity<List<ExerciseDTO>> getAllExercises() {
        return ResponseEntity.ok(exerciseService.getAllExercises());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExerciseDTO> getExerciseById(@PathVariable UUID id) {
        return ResponseEntity.ok(exerciseService.getExerciseById(id));
    }

    @PostMapping
    public ResponseEntity<ExerciseDTO> createExercise(@Valid @RequestBody ExerciseDTO exerciseDTO) {
        return new ResponseEntity<>(exerciseService.createExercise(exerciseDTO), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable UUID id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.noContent().build();
    }
}
