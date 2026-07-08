package com.telecom.controller;

import com.telecom.dto.LoginRequest;
import com.telecom.dto.RegisterRequest;
import com.telecom.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController @RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final com.telecom.repo.UserRepo userRepo;

    public AuthController(AuthService authService, com.telecom.repo.UserRepo userRepo) {
        this.authService = authService; this.userRepo = userRepo;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try { return ResponseEntity.ok(authService.register(req.username(), req.password(), req.fullName())); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try { return ResponseEntity.ok(authService.login(req.username(), req.password())); }
        catch (RuntimeException e) { return ResponseEntity.status(401).body(Map.of("error", e.getMessage())); }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        var user = userRepo.findByUsername(auth.getName()).orElseThrow();
        return ResponseEntity.ok(Map.of("userId", user.getId(), "username", user.getUsername(),
            "fullName", user.getFullName(), "role", user.getRole().name()));
    }
}
