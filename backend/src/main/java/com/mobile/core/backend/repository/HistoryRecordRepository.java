package com.mobile.core.backend.repository;

import com.mobile.core.backend.model.HistoryRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface HistoryRecordRepository extends JpaRepository<HistoryRecord, UUID> {
}
