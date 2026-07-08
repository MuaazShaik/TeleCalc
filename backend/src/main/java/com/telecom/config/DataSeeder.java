package com.telecom.config;

import com.telecom.model.Plan;
import com.telecom.model.User;
import com.telecom.repo.PlanRepo;
import com.telecom.repo.UserRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private final PlanRepo planRepo;
    private final UserRepo userRepo;
    private final PasswordEncoder encoder;

    public DataSeeder(PlanRepo planRepo, UserRepo userRepo, PasswordEncoder encoder) {
        this.planRepo = planRepo; this.userRepo = userRepo; this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        // Seed default admin if no users exist
        if (userRepo.count() == 0) {
            User admin = new User("admin", encoder.encode("admin123"), "System Admin", User.Role.ADMIN);
            userRepo.save(admin);
            User agent = new User("agent", encoder.encode("agent123"), "Demo Agent", User.Role.AGENT);
            userRepo.save(agent);
            System.out.println("╔══════════════════════════════════════════════╗");
            System.out.println("║  DEFAULT ACCOUNTS CREATED                    ║");
            System.out.println("║  Admin  → username: admin  password: admin123║");
            System.out.println("║  Agent  → username: agent  password: agent123║");
            System.out.println("╚══════════════════════════════════════════════╝");
        }

        // Seed sample plans if none exist
        if (planRepo.count() == 0) {
            Plan basic = new Plan();
            basic.setName("Basic");
            basic.setPeakRate(1.5);
            basic.setOffPeakRate(0.5);
            basic.setFreeSeconds(300);   // 5 min free
            basic.setPulseSec(30);
            basic.setPeakStartSec(32400);  // 09:00
            basic.setPeakEndSec(75600);    // 21:00
            planRepo.save(basic);

            Plan premium = new Plan();
            premium.setName("Premium");
            premium.setPeakRate(2.0);
            premium.setOffPeakRate(0.8);
            premium.setFreeSeconds(600);   // 10 min free
            premium.setPulseSec(60);
            premium.setPeakStartSec(32400);
            premium.setPeakEndSec(75600);
            planRepo.save(premium);

            Plan unlimited = new Plan();
            unlimited.setName("Enterprise");
            unlimited.setPeakRate(3.0);
            unlimited.setOffPeakRate(1.0);
            unlimited.setFreeSeconds(1800); // 30 min free
            unlimited.setPulseSec(1);       // per-second billing
            unlimited.setPeakStartSec(28800);  // 08:00
            unlimited.setPeakEndSec(79200);    // 22:00
            planRepo.save(unlimited);

            System.out.println("[TeleCalc] 3 sample plans seeded: Basic, Premium, Enterprise");
        }
    }
}
