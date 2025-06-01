package com.example.hcmiuweb.controllers;

import com.example.hcmiuweb.entities.Role;
import com.example.hcmiuweb.entities.User;
import com.example.hcmiuweb.payload.request.LoginRequest;
import com.example.hcmiuweb.payload.request.RegisterRequest;
import com.example.hcmiuweb.payload.request.PasswordResetRequest;
import com.example.hcmiuweb.payload.request.NewPasswordRequest;
import com.example.hcmiuweb.payload.response.JwtResponse;
import com.example.hcmiuweb.payload.response.MessageResponse;
import com.example.hcmiuweb.repositories.RoleRepository;
import com.example.hcmiuweb.repositories.UserRepository;
import com.example.hcmiuweb.config.jwt.JwtUtils;
import com.example.hcmiuweb.services.UserDetailsImpl;
import com.example.hcmiuweb.services.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private EmailService emailService;

    @GetMapping(value = "/me", produces = "application/json")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();                return ResponseEntity.ok(new JwtResponse(
                    null, // Don't send token in response
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    userDetails.getAvatar(),
                    userDetails.getAuthorities().stream()
                        .map(item -> item.getAuthority())
                        .collect(Collectors.toList())
                ));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping(value = "/signin", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        try {
            logger.info("Authentication attempt for user: {}", loginRequest.getUsername());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            // Set JWT token in HTTP-only cookie
            Cookie jwtCookie = new Cookie("jwt", jwt);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setSecure(false); // Set to true in production with HTTPS
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(24 * 60 * 60); // 24 hours
            response.addCookie(jwtCookie);

            logger.info("User {} successfully authenticated", loginRequest.getUsername());            return ResponseEntity.ok(new JwtResponse(
                null, // Don't send token in response
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getAvatar(),
                roles
            ));
        } catch (BadCredentialsException e) {
            logger.error("Authentication failed for user: {}", loginRequest.getUsername());
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid username or password"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        try {
            logger.info("Registration attempt for username: {}, email: {}", signUpRequest.getUsername(), signUpRequest.getEmail());

            if (userRepository.existsByUsername(signUpRequest.getUsername())) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Username is already taken!"));
            }

            if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Email is already in use!"));
            }

            User user = new User(
                    signUpRequest.getUsername(),
                    signUpRequest.getEmail(),
                    signUpRequest.getPassword(),
                    LocalDateTime.now(),
                    "/resources/static/images/avatars/default-avatar.jpg",
                    null);

            Set<String> strRoles = signUpRequest.getRole();
            Role role;

            if (strRoles == null) {
                role = roleRepository.findByRoleName("ROLE_USER")
                        .orElseThrow(() -> new RuntimeException("Error: Role not found."));
            } else {
                role = roleRepository.findByRoleName(strRoles.iterator().next())
                        .orElseThrow(() -> new RuntimeException("Error: Role not found."));
            }

            user.setRole(role);
            user.setPassword(encoder.encode(user.getPassword()));
            userRepository.save(user);

            logger.info("User registered successfully: {}", signUpRequest.getUsername());
            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (Exception e) {
            logger.error("Registration error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletResponse response) {
        try {
            logger.info("Logout attempt");

            // Clear the authentication from the security context
            SecurityContextHolder.clearContext();

            // Clear the JWT cookie
            Cookie jwtCookie = new Cookie("jwt", null);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setSecure(false); // Set to true in production with HTTPS
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(0); // Delete the cookie
            response.addCookie(jwtCookie);

            logger.info("User successfully logged out");

            return ResponseEntity.ok(new MessageResponse("User logged out successfully!"));
        } catch (Exception e) {
            logger.error("Logout error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse("Error during logout: " + e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody PasswordResetRequest request) {
        try {
            logger.info("Password reset requested for email: {}", request.getEmail());

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found with this email"));

            // Generate reset token
            String resetToken = UUID.randomUUID().toString();
            user.setResetToken(resetToken);
            user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
            userRepository.save(user);

            // Send email
            emailService.sendPasswordResetEmail(user.getEmail(), resetToken);

            logger.info("Password reset email sent to: {}", request.getEmail());
            return ResponseEntity.ok(new MessageResponse("Password reset email sent successfully"));
        } catch (Exception e) {
            logger.error("Error in forgot password: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody NewPasswordRequest request) {
        try {
            logger.info("Password reset attempt with token");

            User user = userRepository.findByResetToken(request.getToken())
                    .orElseThrow(() -> new RuntimeException("Invalid reset token"));

            if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Reset token has expired");
            }

            // Update password
            user.setPassword(encoder.encode(request.getNewPassword()));
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);

            logger.info("Password reset successful for user: {}", user.getUsername());
            return ResponseEntity.ok(new MessageResponse("Password has been reset successfully"));
        } catch (Exception e) {
            logger.error("Error in reset password: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}