package com.telecom.dto;

import java.util.Map;

public record ChargeResponse(
    String planName,
    String startTime,
    String endTime,
    int durationSec,
    int peakSec,
    int offPeakSec,
    int freeDeductedSec,
    int peakBilledSec,
    int offPeakBilledSec,
    double peakCharge,
    double offPeakCharge,
    double totalCharge,
    boolean holidayOverride,
    Map<String, Object> planDetails
) {}
