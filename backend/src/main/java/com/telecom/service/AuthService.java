package com.telecom.service;

import com.telecom.config.JwtUtil;
import com.telecom.model.User;
import com.telecom.repo.UserRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {
    private final UserRepo userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepo userRepo, PasswordEncoder encoder, JwtUtil jwtUtil) {
        this.userRepo = userRepo; this.encoder = encoder; this.jwtUtil = jwtUtil;
    }

    public Map<String, Object> register(String username, String password, String fullName) {
        if (userRepo.existsByUsername(username)) throw new RuntimeException("Username already taken");
        if (password == null || password.length() < 6) throw new RuntimeException("Password must be at least 6 characters");

        // First user becomes ADMIN, rest become AGENT
        User.Role role = userRepo.count() == 0 ? User.Role.ADMIN : User.Role.AGENT;
        User user = new User(username, encoder.encode(password), fullName, role);
        userRepo.save(user);

        String token = jwtUtil.generate(user.getId(), user.getUsername(), user.getRole().name());
        return Map.of("token", token, "username", user.getUsername(),
            "fullName", user.getFullName(), "role", user.getRole().name(), "userId", user.getId());
    }

    public Map<String, Object> login(String username, String password) {
        User user = userRepo.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!encoder.matches(password, user.getPassword())) throw new RuntimeException("Invalid credentials");

        String token = jwtUtil.generate(user.getId(), user.getUsername(), user.getRole().name());
        return Map.of("token", token, "username", user.getUsername(),
            "fullName", user.getFullName(), "role", user.getRole().name(), "userId", user.getId());
    }
}
