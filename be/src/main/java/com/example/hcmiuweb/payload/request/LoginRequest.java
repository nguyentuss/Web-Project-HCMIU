package com.example.hcmiuweb.payload.request;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    private String username;

    private String password;

    public String getUsername() { return username; }
    public void setUsername(String u) { this.username = u; }
    public String getPassword() { return password; }
    public void setPassword(String p) { this.password = p; }
}