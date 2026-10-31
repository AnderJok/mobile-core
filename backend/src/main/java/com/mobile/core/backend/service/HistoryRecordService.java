package com.mobile.core.backend.service;

import com.mobile.core.backend.dto.HistoryRecordDTO;
import com.mobile.core.backend.mapper.HistoryRecordMapper;
import com.mobile.core.backend.model.HistoryRecord;
import com.mobile.core.backend.repository.HistoryRecordRepository;
import com.mobile.core.backend.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoryRecordService {
    private final HistoryRecordRepository repository;
    private final WorkoutRepository workoutRepository;
    private final HistoryRecordMapper mapper;

    @Transactional
    public HistoryRecordDTO createHistoryRecord(HistoryRecordDTO dto) {
        if (dto.getDurationInSeconds() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duration must not be negative");
        }
        if (!workoutRepository.existsById(dto.getWorkoutId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found");
        }
        HistoryRecord record = mapper.toEntity(dto);
        record.setCreatedAt(new Date());
        return mapper.toDto(repository.save(record));
    }

    @Transactional(readOnly = true)
    public List<HistoryRecordDTO> getAllHistoryRecords() {
        return repository.findAll()
                .stream()
                .map(mapper::toDto)
                .sorted(Comparator.comparing(HistoryRecordDTO::getDate).reversed())
                .toList();
    }
}
