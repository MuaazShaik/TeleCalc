package com.telecom.controller;

import com.telecom.model.User;
import com.telecom.repo.UserRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController @RequestMapping("/api/admin/users")
public class UserController {
    private final UserRepo userRepo;

    public UserController(UserRepo userRepo) { this.userRepo = userRepo; }

    @GetMapping
    public List<User> all() {
        return userRepo.findAll().stream().peek(u -> u.setPassword("***")).toList();
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> changeRole(@PathVariable Long id, @RequestBody Map<String, String> body, Authentication auth) {
        return userRepo.findById(id).map(user -> {
            // Cannot demote yourself
            if (user.getUsername().equals(auth.getName())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Cannot change your own role"));
            }
            user.setRole(User.Role.valueOf(body.get("role")));
            userRepo.save(user);
            return ResponseEntity.ok(Map.of("success", true));
        }).orElse(ResponseEntity.notFound().build());
    }
}
