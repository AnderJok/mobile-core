package com.mobile.core.backend.controller;

import com.mobile.core.backend.dto.WorkoutTagDTO;
import com.mobile.core.backend.service.WorkoutTagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workout-tags")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class WorkoutTagController {
    private final WorkoutTagService service;

    @GetMapping
    public List<WorkoutTagDTO> getAllTags() {
        return service.getAllTags();
    }

    @PostMapping
    public ResponseEntity<WorkoutTagDTO> createTag(@Valid @RequestBody WorkoutTagDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createTag(dto));
    }
}
