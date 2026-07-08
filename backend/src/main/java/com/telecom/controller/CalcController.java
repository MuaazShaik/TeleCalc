package com.telecom.controller;

import com.telecom.dto.ChargeRequest;
import com.telecom.dto.ChargeResponse;
import com.telecom.repo.CallRecordRepo;
import com.telecom.service.ChargeService;
import com.telecom.service.HolidayService;
import com.telecom.service.TimeZoneService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController @RequestMapping("/api")
public class CalcController {
    private final ChargeService chargeService;
    private final CallRecordRepo callRepo;
    private final HolidayService holidayService;
    private final TimeZoneService timeZoneService;

    public CalcController(ChargeService chargeService, CallRecordRepo callRepo,
                          HolidayService holidayService, TimeZoneService timeZoneService) {
        this.chargeService = chargeService; this.callRepo = callRepo;
        this.holidayService = holidayService; this.timeZoneService = timeZoneService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<?> calculate(@RequestBody ChargeRequest req, Authentication auth) {
        try {
            Long userId = (Long) auth.getDetails();
            ChargeResponse res = chargeService.calculate(req.planId(), req.startTime(), req.durationSec(), userId, auth.getName());
            return ResponseEntity.ok(res);
        } catch (RuntimeException e) { return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
    }

    @PostMapping("/recommend")
    public ResponseEntity<?> recommend(@RequestBody ChargeRequest req) {
        try {
            var recommendations = chargeService.recommendPlans(req.planId(), req.startTime(), req.durationSec());
            return ResponseEntity.ok(recommendations);
        } catch (RuntimeException e) { return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
    }

    @GetMapping("/history")
    public Object history(Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN"));
        if (isAdmin) return callRepo.findAllByOrderByCalculatedAtDesc();
        Long userId = (Long) auth.getDetails();
        return callRepo.findByUserIdOrderByCalculatedAtDesc(userId);
    }

    @GetMapping("/time/current")
    public Map<String, Object> currentTime() { return timeZoneService.getCurrentTime(); }

    @GetMapping("/time/holidays")
    public Object holidays() { return holidayService.getUpcomingHolidays(); }

    @GetMapping("/time/zone-status")
    public Map<String, Object> zoneStatus(@RequestParam(defaultValue = "32400") int peakStart,
                                           @RequestParam(defaultValue = "75600") int peakEnd) {
        var status = timeZoneService.getZoneStatus(peakStart, peakEnd);
        var result = new java.util.HashMap<>(status);
        result.put("isHoliday", holidayService.isTodayHoliday());
        return result;
    }
}
