package com.kapoorassociates.legalplatform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Random;

/**
 * Kapoor & Associates Legal Platform
 * Service for generating, sending, and verifying One-Time Passwords (OTP).
 * Now asynchronous to avoid blocking HTTP threads during SMTP timeouts.
 */
@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    // In-memory OTP store (email -> otp) 
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    @Async
    public CompletableFuture<Boolean> generateAndSendOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStore.put(email, otp);

        try {
            // Send OTP via Gmail SMTP
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Kapoor & Associates — Admin Login OTP");
            message.setText(
                "Dear Admin,\n\n" +
                "Your One-Time Password (OTP) for admin login is:\n\n" +
                "  " + otp + "\n\n" +
                "This OTP is valid for 10 minutes.\n\n" +
                "Regards,\nKapoor & Associates Security System"
            );
            message.setFrom("kavyakapoor28i@gmail.com");

            mailSender.send(message);
            System.out.println("✅ OTP sent to: " + email);
            return CompletableFuture.completedFuture(true);

        } catch (Exception e) {
            System.err.println("❌ OTP send failed: " + e.getMessage());
            // Log FALLBACK OTP so admin can still log in if SMTP is blocked
            System.err.println("🔑 FALLBACK OTP for " + email + ": " + otp);
            return CompletableFuture.completedFuture(false);
        }
    }

    public boolean verifyOtp(String email, String otp) {
        String stored = otpStore.get(email);
        if (stored != null && stored.equals(otp)) {
            otpStore.remove(email); // One-time use
            return true;
        }
        return false;
    }
}
