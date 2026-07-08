package com.telecom.controller;

import com.telecom.model.Plan;
import com.telecom.repo.PlanRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class PlanController {
    private final PlanRepo planRepo;

    public PlanController(PlanRepo planRepo) { this.planRepo = planRepo; }

    @GetMapping("/api/plans")
    public List<Plan> all() { return planRepo.findAll(); }

    @PostMapping("/api/admin/plans")
    public Plan create(@RequestBody Plan plan) { return planRepo.save(plan); }

    @PutMapping("/api/admin/plans/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Plan plan) {
        return planRepo.findById(id).map(p -> {
            p.setName(plan.getName()); p.setPeakRate(plan.getPeakRate());
            p.setOffPeakRate(plan.getOffPeakRate()); p.setFreeSeconds(plan.getFreeSeconds());
            p.setPulseSec(plan.getPulseSec()); p.setPeakStartSec(plan.getPeakStartSec());
            p.setPeakEndSec(plan.getPeakEndSec());
            return ResponseEntity.ok(planRepo.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/api/admin/plans/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!planRepo.existsById(id)) return ResponseEntity.notFound().build();
        planRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("deleted", true));
    }
}
