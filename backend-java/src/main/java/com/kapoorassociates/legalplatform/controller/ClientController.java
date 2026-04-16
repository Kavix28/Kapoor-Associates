package com.kapoorassociates.legalplatform.controller;

import com.kapoorassociates.legalplatform.model.Client;
import com.kapoorassociates.legalplatform.model.PendingLogin;
import com.kapoorassociates.legalplatform.repository.ClientRepository;
import com.kapoorassociates.legalplatform.repository.PendingLoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/client")
@CrossOrigin(origins = "*")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PendingLoginRepository pendingLoginRepository;

    @PostMapping("/login-request")
    public ResponseEntity<?> requestLogin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<Client> clientOpt = clientRepository.findByEmail(email);

        if (clientOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Client not found");
        }

        // In a real app, we'd trigger an n8n webhook here to send the OTP.
        // For now, we'll store a mock OTP (123456) for testing.
        PendingLogin pending = PendingLogin.builder()
                .email(email)
                .otp("123456")
                .build();
        pendingLoginRepository.save(pending);

        return ResponseEntity.ok("OTP sent to registered email/phone");
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyLogin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        Optional<PendingLogin> pendingOpt = pendingLoginRepository.findById(email);
        if (pendingOpt.isEmpty() || !pendingOpt.get().getOtp().equals(otp)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid OTP");
        }

        // Clear pending login
        pendingLoginRepository.deleteById(email);

        // Fetch client and return profile
        Client client = clientRepository.findByEmail(email).get();
        return ResponseEntity.ok(client);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam String email) {
        Optional<Client> clientOpt = clientRepository.findByEmail(email);
        return clientOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
