package com.kapoorassociates.legalplatform.controller;

import com.kapoorassociates.legalplatform.dto.AdminLoginRequest;
import com.kapoorassociates.legalplatform.dto.OtpVerifyRequest;
import com.kapoorassociates.legalplatform.model.AdminUser;
import com.kapoorassociates.legalplatform.repository.AdminUserRepository;
import com.kapoorassociates.legalplatform.service.OtpService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;
import java.util.Optional;

/**
 * Kapoor & Associates Legal Platform
 * AuthController for admin authentication with two-step OTP verification.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;

    @Value("${jwt.secret:your-super-secret-jwt-key-change-this-in-production}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")
    private long jwtExpiration;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest request) {
        try {
            Optional<AdminUser> adminOpt = adminUserRepository.findByEmail(request.getEmail());

            if (adminOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), adminOpt.get().getPasswordHash())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "success", false,
                    "message", "Invalid email or password"
                ));
            }

            // Password correct — send OTP via email
            otpService.generateAndSendOtp(request.getEmail());

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "OTP sent to your email. Please verify to complete login.",
                "otpRequired", true
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerifyRequest request) {
        try {
            boolean valid = otpService.verifyOtp(request.getEmail(), request.getOtp());

            if (!valid) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "success", false,
                    "message", "Invalid or expired OTP"
                ));
            }

            String token = generateToken(request.getEmail());

            return ResponseEntity.ok(Map.of(
                "success", true,
                "token", token,
                "message", "Login successful"
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    private String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", "admin")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }
}
