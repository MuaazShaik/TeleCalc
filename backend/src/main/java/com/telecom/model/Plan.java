package com.telecom.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity @Table(name = "plans")
public class Plan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private double peakRate;        // ₹ per minute

    @Column(nullable = false)
    private double offPeakRate;     // ₹ per minute

    @Column(nullable = false)
    private int freeSeconds;        // free bundle in seconds

    @Column(nullable = false)
    private int pulseSec;           // pulse length in seconds (e.g. 30)

    @Column(nullable = false)
    private int peakStartSec;       // seconds since midnight (e.g. 32400 = 09:00)

    @Column(nullable = false)
    private int peakEndSec;         // seconds since midnight (e.g. 75600 = 21:00)

    private LocalDateTime createdAt = LocalDateTime.now();

    public Plan() {}

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String n) { this.name = n; }
    public double getPeakRate() { return peakRate; }
    public void setPeakRate(double r) { this.peakRate = r; }
    public double getOffPeakRate() { return offPeakRate; }
    public void setOffPeakRate(double r) { this.offPeakRate = r; }
    public int getFreeSeconds() { return freeSeconds; }
    public void setFreeSeconds(int s) { this.freeSeconds = s; }
    public int getPulseSec() { return pulseSec; }
    public void setPulseSec(int s) { this.pulseSec = s; }
    public int getPeakStartSec() { return peakStartSec; }
    public void setPeakStartSec(int s) { this.peakStartSec = s; }
    public int getPeakEndSec() { return peakEndSec; }
    public void setPeakEndSec(int s) { this.peakEndSec = s; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
