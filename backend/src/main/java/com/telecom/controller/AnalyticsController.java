package com.telecom.controller;

import com.telecom.repo.CallRecordRepo;
import com.telecom.repo.PlanRepo;
import com.telecom.repo.UserRepo;
import com.telecom.model.User;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController @RequestMapping("/api/admin/analytics")
public class AnalyticsController {
    private final CallRecordRepo callRepo;
    private final PlanRepo planRepo;
    private final UserRepo userRepo;

    public AnalyticsController(CallRecordRepo callRepo, PlanRepo planRepo, UserRepo userRepo) {
        this.callRepo = callRepo; this.planRepo = planRepo; this.userRepo = userRepo;
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime weekStart = LocalDate.now().minusDays(7).atStartOfDay();
        Double todayRev = callRepo.getRevenueAfter(todayStart);
        Double weekRev = callRepo.getRevenueAfter(weekStart);
        return Map.of(
            "callsToday", callRepo.countByCalculatedAtAfter(todayStart),
            "revenueToday", todayRev != null ? Math.round(todayRev * 100.0) / 100.0 : 0.0,
            "revenueWeek", weekRev != null ? Math.round(weekRev * 100.0) / 100.0 : 0.0,
            "activePlans", planRepo.count(),
            "totalAgents", userRepo.countByRole(User.Role.AGENT),
            "totalRecords", callRepo.count()
        );
    }

    @GetMapping("/heatmap")
    public List<Map<String, Object>> heatmap() {
        List<Object[]> raw = callRepo.getHourlyHeatmap();
        // Build full 24-hour array
        Map<Integer, Map<String, Object>> hourMap = new LinkedHashMap<>();
        for (int h = 0; h < 24; h++) hourMap.put(h, Map.of("hour", h, "calls", 0L, "revenue", 0.0));
        for (Object[] row : raw) {
            int hour = ((Number) row[0]).intValue();
            long calls = ((Number) row[1]).longValue();
            double rev = row[2] != null ? ((Number) row[2]).doubleValue() : 0.0;
            hourMap.put(hour, Map.of("hour", hour, "calls", calls, "revenue", Math.round(rev * 100.0) / 100.0));
        }
        return new ArrayList<>(hourMap.values());
    }
}
