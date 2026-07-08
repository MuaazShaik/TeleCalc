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
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class HolidayService {
    private final String apiUrl;
    private final String countryCode;
    private final HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
    private final ObjectMapper mapper = new ObjectMapper();
    private final Map<Integer, Set<String>> cache = new ConcurrentHashMap<>();
    private volatile int lastFetchedYear = -1;

    public HolidayService(@Value("${holiday.api-url}") String apiUrl,
                           @Value("${holiday.country-code}") String countryCode) {
        this.apiUrl = apiUrl; this.countryCode = countryCode;
    }

    public boolean isTodayHoliday() {
        LocalDate today = LocalDate.now();
        return getHolidays(today.getYear()).contains(today.toString());
    }

    public List<Map<String, String>> getUpcomingHolidays() {
        LocalDate today = LocalDate.now();
        Set<String> holidays = getHolidays(today.getYear());
        List<Map<String, String>> upcoming = new ArrayList<>();
        // Return cached data as simple list
        for (String date : holidays) {
            if (!LocalDate.parse(date).isBefore(today)) {
                upcoming.add(Map.of("date", date));
            }
        }
        upcoming.sort(Comparator.comparing(m -> m.get("date")));
        return upcoming.subList(0, Math.min(10, upcoming.size()));
    }

    private Set<String> getHolidays(int year) {
        if (cache.containsKey(year) && lastFetchedYear == year) return cache.get(year);
        try {
            String url = apiUrl + "/PublicHolidays/" + year + "/" + countryCode;
            HttpRequest req = HttpRequest.newBuilder().uri(URI.create(url))
                .timeout(Duration.ofSeconds(5)).GET().build();
            HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
            if (res.statusCode() == 200) {
                Set<String> dates = new HashSet<>();
                JsonNode arr = mapper.readTree(res.body());
                for (JsonNode node : arr) dates.add(node.get("date").asText());
                cache.put(year, dates);
                lastFetchedYear = year;
                return dates;
            }
        } catch (Exception e) { /* Fallback: no holidays — charge normally */ }
        return cache.getOrDefault(year, Set.of());
    }
}
