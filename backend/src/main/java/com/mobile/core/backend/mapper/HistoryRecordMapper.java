package com.mobile.core.backend.mapper;

import com.mobile.core.backend.dto.HistoryRecordDTO;
import com.mobile.core.backend.model.HistoryRecord;
import org.springframework.stereotype.Component;

@Component
public class HistoryRecordMapper {
    public HistoryRecordDTO toDto(HistoryRecord record) {
        HistoryRecordDTO dto = new HistoryRecordDTO();
        dto.setId(record.getId());
        dto.setWorkoutId(record.getWorkoutId());
        dto.setWorkoutName(record.getWorkoutName());
        dto.setDate(record.getDate());
        dto.setDurationInSeconds(record.getDurationInSeconds());
        dto.setNote(record.getNotes());
        return dto;
    }

    public HistoryRecord toEntity(HistoryRecordDTO dto) {
        return HistoryRecord.builder()
                .workoutId(dto.getWorkoutId())
                .workoutName(dto.getWorkoutName().trim())
                .date(dto.getDate())
                .durationInSeconds(dto.getDurationInSeconds())
                .notes(dto.getNote())
                .build();
    }
}
