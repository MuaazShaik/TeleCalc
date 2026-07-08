package com.telecom.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity @Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Role role = Role.AGENT;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role { ADMIN, AGENT }

    public User() {}
    public User(String username, String password, String fullName, Role role) {
        this.username = username; this.password = password;
        this.fullName = fullName; this.role = role;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public void setUsername(String u) { this.username = u; }
    public String getPassword() { return password; }
    public void setPassword(String p) { this.password = p; }
    public String getFullName() { return fullName; }
    public void setFullName(String f) { this.fullName = f; }
    public Role getRole() { return role; }
    public void setRole(Role r) { this.role = r; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
