package com.telecom.repo;

import com.telecom.model.Plan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlanRepo extends JpaRepository<Plan, Long> {}
