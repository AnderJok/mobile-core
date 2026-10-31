package com.mobile.core.backend.controller;

import com.mobile.core.backend.dto.HistoryRecordDTO;
import com.mobile.core.backend.service.HistoryRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/history-records")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class HistoryRecordController {
    private final HistoryRecordService service;

    @PostMapping
    public ResponseEntity<HistoryRecordDTO> createHistoryRecord(@Valid @RequestBody HistoryRecordDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createHistoryRecord(dto));
    }

    @GetMapping
    public ResponseEntity<List<HistoryRecordDTO>> getAllHistoryRecords() {
        return ResponseEntity.ok(service.getAllHistoryRecords());
    }
}
