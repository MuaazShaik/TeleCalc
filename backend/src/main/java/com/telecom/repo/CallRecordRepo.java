package com.telecom.repo;

import com.telecom.model.CallRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface CallRecordRepo extends JpaRepository<CallRecord, Long> {
    List<CallRecord> findByUserIdOrderByCalculatedAtDesc(Long userId);
    List<CallRecord> findAllByOrderByCalculatedAtDesc();
    List<CallRecord> findByCalculatedAtAfter(LocalDateTime after);
    long countByCalculatedAtAfter(LocalDateTime after);

    @Query("SELECT c.startTimeSec / 3600, COUNT(c), SUM(c.totalCharge) FROM CallRecord c GROUP BY c.startTimeSec / 3600 ORDER BY c.startTimeSec / 3600")
    List<Object[]> getHourlyHeatmap();

    @Query("SELECT SUM(c.totalCharge) FROM CallRecord c WHERE c.calculatedAt > ?1")
    Double getRevenueAfter(LocalDateTime after);
}
