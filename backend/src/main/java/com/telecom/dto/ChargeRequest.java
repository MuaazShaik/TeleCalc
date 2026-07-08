package com.telecom.dto;

public record ChargeRequest(Long planId, String startTime, int durationSec) {}
