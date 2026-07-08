package com.telecom.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalTime;
import java.util.Map;

@Service
public class TimeZoneService {
    private final String apiUrl;
    private final String zone;
    private final HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
    private final ObjectMapper mapper = new ObjectMapper();

    public TimeZoneService(@Value("${timezone.api-url}") String apiUrl, @Value("${timezone.zone}") String zone) {
        this.apiUrl = apiUrl; this.zone = zone;
    }

    public Map<String, Object> getCurrentTime() {
        try {
            String url = apiUrl + "/" + zone;
            HttpRequest req = HttpRequest.newBuilder().uri(URI.create(url))
                .timeout(Duration.ofSeconds(5)).GET().build();
            HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
            if (res.statusCode() == 200) {
                JsonNode json = mapper.readTree(res.body());
                String datetime = json.get("datetime").asText();
                String abbreviation = json.has("abbreviation") ? json.get("abbreviation").asText() : zone;
                return Map.of("datetime", datetime, "timezone", zone, "abbreviation", abbreviation, "source", "api");
            }
        } catch (Exception e) { /* Fallback below */ }

        // Fallback: use server clock
        return Map.of("datetime", java.time.ZonedDateTime.now(java.time.ZoneId.of(zone)).toString(),
            "timezone", zone, "abbreviation", zone, "source", "server");
    }

    /** Check if the given seconds-since-midnight falls in peak window */
    public Map<String, Object> getZoneStatus(int peakStartSec, int peakEndSec) {
        LocalTime now = LocalTime.now(java.time.ZoneId.of(zone));
        int nowSec = now.toSecondOfDay();
        boolean isPeak;
        int secsUntilSwitch;

        if (peakStartSec < peakEndSec) {
            isPeak = nowSec >= peakStartSec && nowSec < peakEndSec;
            secsUntilSwitch = isPeak ? (peakEndSec - nowSec) : (nowSec < peakStartSec ? peakStartSec - nowSec : 86400 - nowSec + peakStartSec);
        } else {
            isPeak = nowSec >= peakStartSec || nowSec < peakEndSec;
            secsUntilSwitch = isPeak ? (nowSec >= peakStartSec ? 86400 - nowSec + peakEndSec : peakEndSec - nowSec) : (peakStartSec - nowSec);
        }

        return Map.of("isPeak", isPeak, "currentTimeSec", nowSec,
            "secondsUntilSwitch", secsUntilSwitch, "currentTime", now.toString());
    }
}
