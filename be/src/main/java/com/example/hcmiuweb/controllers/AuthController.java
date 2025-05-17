package com.example.hcmiuweb.controllers;

import com.example.hcmiuweb.entities.Role;
import com.example.hcmiuweb.entities.User;
import com.example.hcmiuweb.payload.request.LoginRequest;
import com.example.hcmiuweb.payload.request.RegisterRequest;
import com.example.hcmiuweb.payload.response.JwtResponse;
import com.example.hcmiuweb.payload.response.MessageResponse;
import com.example.hcmiuweb.repositories.RoleRepository;
import com.example.hcmiuweb.repositories.UserRepository;
import com.example.hcmiuweb.config.jwt.JwtUtils;
import com.example.hcmiuweb.services.UserDetailsImpl;
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
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
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

    @GetMapping(value = "/me", produces = "application/json")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                return ResponseEntity.ok(new JwtResponse(
                    null, // Don't send token in response
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
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

            logger.info("User {} successfully authenticated", loginRequest.getUsername());

            return ResponseEntity.ok(new JwtResponse(
                null, // Don't send token in response
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
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
}