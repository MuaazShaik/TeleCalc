package com.telecom.dto;

public record PlanRecommendation(
    Long planId,
    String planName,
    double peakRate,
    double offPeakRate,
    int freeSeconds,
    int pulseSec,
    double totalCharge,
    double savings,
    boolean isCurrent,
    boolean isCheapest
) {}
