package com.kapoorassociates.legalplatform.controller;

import com.kapoorassociates.legalplatform.dto.AdminLoginRequest;
import com.kapoorassociates.legalplatform.model.AdminUser;
import com.kapoorassociates.legalplatform.repository.AdminUserRepository;
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

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.secret:your-super-secret-jwt-key-change-this-in-production}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")
    private long jwtExpiration;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest request) {
        Optional<AdminUser> adminOpt = adminUserRepository.findByEmail(request.getEmail());

        if (adminOpt.isPresent() && passwordEncoder.matches(request.getPassword(), adminOpt.get().getPasswordHash())) {
            AdminUser admin = adminOpt.get();
            
            String token = Jwts.builder()
                    .setSubject(admin.getEmail())
                    .claim("role", admin.getRole())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                    .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()), SignatureAlgorithm.HS256)
                    .compact();

            return ResponseEntity.ok(Map.of(
                "success", true,
                "token", token,
                "message", "Login successful"
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
            "success", false,
            "message", "Invalid credentials"
        ));
    }
}
