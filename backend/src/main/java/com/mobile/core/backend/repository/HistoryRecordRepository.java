package com.mobile.core.backend.repository;

import com.mobile.core.backend.model.HistoryRecord;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface HistoryRecordRepository extends JpaRepository<HistoryRecord, UUID> {
    List<HistoryRecord> findAllByOrderByDateDesc();

    List<HistoryRecord> findAllByOrderByDateDesc(Pageable pageable);
}
