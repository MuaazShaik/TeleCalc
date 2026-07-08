package com.telecom.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity @Table(name = "call_records")
public class CallRecord {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long planId;

    private String planName;
    private String username;
    private int startTimeSec;       // seconds since midnight
    private int durationSec;
    private int peakSec;            // raw peak seconds
    private int offPeakSec;         // raw off-peak seconds
    private int freeDeductedSec;
    private int peakBilledSec;      // after free deduction + pulse rounding
    private int offPeakBilledSec;
    private double peakCharge;
    private double offPeakCharge;
    private double totalCharge;
    private boolean holidayOverride;
    private LocalDateTime calculatedAt = LocalDateTime.now();

    public CallRecord() {}

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long u) { this.userId = u; }
    public Long getPlanId() { return planId; }
    public void setPlanId(Long p) { this.planId = p; }
    public String getPlanName() { return planName; }
    public void setPlanName(String n) { this.planName = n; }
    public String getUsername() { return username; }
    public void setUsername(String u) { this.username = u; }
    public int getStartTimeSec() { return startTimeSec; }
    public void setStartTimeSec(int s) { this.startTimeSec = s; }
    public int getDurationSec() { return durationSec; }
    public void setDurationSec(int d) { this.durationSec = d; }
    public int getPeakSec() { return peakSec; }
    public void setPeakSec(int s) { this.peakSec = s; }
    public int getOffPeakSec() { return offPeakSec; }
    public void setOffPeakSec(int s) { this.offPeakSec = s; }
    public int getFreeDeductedSec() { return freeDeductedSec; }
    public void setFreeDeductedSec(int s) { this.freeDeductedSec = s; }
    public int getPeakBilledSec() { return peakBilledSec; }
    public void setPeakBilledSec(int s) { this.peakBilledSec = s; }
    public int getOffPeakBilledSec() { return offPeakBilledSec; }
    public void setOffPeakBilledSec(int s) { this.offPeakBilledSec = s; }
    public double getPeakCharge() { return peakCharge; }
    public void setPeakCharge(double c) { this.peakCharge = c; }
    public double getOffPeakCharge() { return offPeakCharge; }
    public void setOffPeakCharge(double c) { this.offPeakCharge = c; }
    public double getTotalCharge() { return totalCharge; }
    public void setTotalCharge(double c) { this.totalCharge = c; }
    public boolean isHolidayOverride() { return holidayOverride; }
    public void setHolidayOverride(boolean h) { this.holidayOverride = h; }
    public LocalDateTime getCalculatedAt() { return calculatedAt; }
}
