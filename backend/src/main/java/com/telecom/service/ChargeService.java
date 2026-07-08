package com.telecom.service;

import com.telecom.dto.ChargeResponse;
import com.telecom.dto.PlanRecommendation;
import com.telecom.model.CallRecord;
import com.telecom.model.Plan;
import com.telecom.repo.CallRecordRepo;
import com.telecom.repo.PlanRepo;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class ChargeService {
    private final PlanRepo planRepo;
    private final CallRecordRepo callRepo;
    private final HolidayService holidayService;

    public ChargeService(PlanRepo planRepo, CallRecordRepo callRepo, HolidayService holidayService) {
        this.planRepo = planRepo; this.callRepo = callRepo; this.holidayService = holidayService;
    }

    public ChargeResponse calculate(Long planId, String startTime, int durationSec, Long userId, String username) {
        Plan p = planRepo.findById(planId).orElseThrow(() -> new RuntimeException("Plan not found"));

        // Parse start time to seconds since midnight
        String[] parts = startTime.split(":");
        int startSec = Integer.parseInt(parts[0]) * 3600 + Integer.parseInt(parts[1]) * 60
            + (parts.length > 2 ? Integer.parseInt(parts[2]) : 0);
        int endSec = (startSec + durationSec) % 86400;

        // Holiday check — if holiday, entire call is off-peak
        boolean isHoliday = holidayService.isTodayHoliday();

        int peakSec = 0, offPeakSec = 0;

        if (isHoliday) {
            // Holiday: all off-peak
            offPeakSec = durationSec;
        } else {
            // Calculate peak/off-peak segments
            peakSec = computePeakSeconds(startSec, durationSec, p.getPeakStartSec(), p.getPeakEndSec());
            offPeakSec = durationSec - peakSec;
        }

        // Deduct free minutes from peak (costlier) first
        int freeRemaining = p.getFreeSeconds();
        int peakAfterFree = peakSec;
        int offPeakAfterFree = offPeakSec;
        int totalFreeUsed = 0;

        if (freeRemaining > 0 && peakAfterFree > 0) {
            int deduct = Math.min(freeRemaining, peakAfterFree);
            peakAfterFree -= deduct;
            freeRemaining -= deduct;
            totalFreeUsed += deduct;
        }
        if (freeRemaining > 0 && offPeakAfterFree > 0) {
            int deduct = Math.min(freeRemaining, offPeakAfterFree);
            offPeakAfterFree -= deduct;
            totalFreeUsed += deduct;
        }

        // Pulse-round each segment
        int peakBilled = pulseRound(peakAfterFree, p.getPulseSec());
        int offPeakBilled = pulseRound(offPeakAfterFree, p.getPulseSec());

        // Calculate charges
        double peakCharge = (peakBilled / 60.0) * p.getPeakRate();
        double offPeakCharge = (offPeakBilled / 60.0) * p.getOffPeakRate();
        double total = Math.round((peakCharge + offPeakCharge) * 100.0) / 100.0;
        peakCharge = Math.round(peakCharge * 100.0) / 100.0;
        offPeakCharge = Math.round(offPeakCharge * 100.0) / 100.0;

        // Format end time
        String endTimeStr = String.format("%02d:%02d:%02d", endSec / 3600, (endSec % 3600) / 60, endSec % 60);

        // Save record
        CallRecord rec = new CallRecord();
        rec.setUserId(userId); rec.setPlanId(planId); rec.setPlanName(p.getName()); rec.setUsername(username);
        rec.setStartTimeSec(startSec); rec.setDurationSec(durationSec);
        rec.setPeakSec(peakSec); rec.setOffPeakSec(offPeakSec);
        rec.setFreeDeductedSec(totalFreeUsed);
        rec.setPeakBilledSec(peakBilled); rec.setOffPeakBilledSec(offPeakBilled);
        rec.setPeakCharge(peakCharge); rec.setOffPeakCharge(offPeakCharge);
        rec.setTotalCharge(total); rec.setHolidayOverride(isHoliday);
        callRepo.save(rec);

        return new ChargeResponse(p.getName(), startTime, endTimeStr, durationSec,
            peakSec, offPeakSec, totalFreeUsed, peakBilled, offPeakBilled,
            peakCharge, offPeakCharge, total, isHoliday,
            Map.of("peakRate", p.getPeakRate(), "offPeakRate", p.getOffPeakRate(),
                "freeSeconds", p.getFreeSeconds(), "pulseSec", p.getPulseSec()));
    }

    /**
     * AI-Powered Plan Recommendation Engine.
     * Simulates the same call across ALL available plans and returns them
     * sorted by total charge (cheapest first), with savings vs. current plan.
     */
    public List<PlanRecommendation> recommendPlans(Long currentPlanId, String startTime, int durationSec) {
        List<Plan> allPlans = planRepo.findAll();
        boolean isHoliday = holidayService.isTodayHoliday();

        String[] parts = startTime.split(":");
        int startSec = Integer.parseInt(parts[0]) * 3600 + Integer.parseInt(parts[1]) * 60
            + (parts.length > 2 ? Integer.parseInt(parts[2]) : 0);

        // Simulate charge on every plan
        List<PlanRecommendation> results = new ArrayList<>();
        double currentPlanCharge = 0;

        for (Plan p : allPlans) {
            double charge = simulateChargeForPlan(p, startSec, durationSec, isHoliday);
            if (p.getId().equals(currentPlanId)) currentPlanCharge = charge;
            results.add(new PlanRecommendation(
                p.getId(), p.getName(), p.getPeakRate(), p.getOffPeakRate(),
                p.getFreeSeconds(), p.getPulseSec(), charge,
                0, // savings placeholder — filled below
                p.getId().equals(currentPlanId),
                false // isCheapest placeholder
            ));
        }

        // Sort by charge ascending
        results.sort(Comparator.comparingDouble(PlanRecommendation::totalCharge));

        // Rebuild with savings and cheapest flag
        final double currentCharge = currentPlanCharge;
        List<PlanRecommendation> finalResults = new ArrayList<>();
        for (int i = 0; i < results.size(); i++) {
            PlanRecommendation r = results.get(i);
            double savings = Math.round((currentCharge - r.totalCharge()) * 100.0) / 100.0;
            finalResults.add(new PlanRecommendation(
                r.planId(), r.planName(), r.peakRate(), r.offPeakRate(),
                r.freeSeconds(), r.pulseSec(), r.totalCharge(),
                savings, r.isCurrent(), i == 0
            ));
        }

        return finalResults;
    }

    /**
     * Simulate the billing engine for a given plan WITHOUT saving to DB.
     * Uses the exact same algorithm as calculate() for consistency.
     */
    private double simulateChargeForPlan(Plan p, int startSec, int durationSec, boolean isHoliday) {
        int peakSec, offPeakSec;

        if (isHoliday) {
            peakSec = 0;
            offPeakSec = durationSec;
        } else {
            peakSec = computePeakSeconds(startSec, durationSec, p.getPeakStartSec(), p.getPeakEndSec());
            offPeakSec = durationSec - peakSec;
        }

        // Free minute deduction (peak-first)
        int freeRemaining = p.getFreeSeconds();
        int peakAfterFree = peakSec;
        int offPeakAfterFree = offPeakSec;

        if (freeRemaining > 0 && peakAfterFree > 0) {
            int deduct = Math.min(freeRemaining, peakAfterFree);
            peakAfterFree -= deduct;
            freeRemaining -= deduct;
        }
        if (freeRemaining > 0 && offPeakAfterFree > 0) {
            int deduct = Math.min(freeRemaining, offPeakAfterFree);
            offPeakAfterFree -= deduct;
        }

        // Pulse rounding
        int peakBilled = pulseRound(peakAfterFree, p.getPulseSec());
        int offPeakBilled = pulseRound(offPeakAfterFree, p.getPulseSec());

        // Charge
        double peakCharge = (peakBilled / 60.0) * p.getPeakRate();
        double offPeakCharge = (offPeakBilled / 60.0) * p.getOffPeakRate();
        return Math.round((peakCharge + offPeakCharge) * 100.0) / 100.0;
    }

    /** Compute how many seconds of a call fall within the peak window. Handles midnight crossing. */
    private int computePeakSeconds(int startSec, int duration, int peakStart, int peakEnd) {
        int total = 0;
        for (int i = 0; i < duration; i++) {
            int t = (startSec + i) % 86400;
            if (peakStart < peakEnd) {
                if (t >= peakStart && t < peakEnd) total++;
            } else {
                // Peak crosses midnight (e.g., 22:00 - 06:00)
                if (t >= peakStart || t < peakEnd) total++;
            }
        }
        return total;
    }

    /** Round up to next pulse. Zero stays zero. */
    private int pulseRound(int seconds, int pulse) {
        if (seconds <= 0 || pulse <= 0) return 0;
        return (int) Math.ceil((double) seconds / pulse) * pulse;
    }
}

