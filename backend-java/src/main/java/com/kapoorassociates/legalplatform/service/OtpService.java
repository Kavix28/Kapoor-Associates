package com.kapoorassociates.legalplatform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Random;

/**
 * Kapoor & Associates Legal Platform
 * Service for generating, sending, and verifying One-Time Passwords (OTP).
 */
@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    // In-memory OTP store (email -> otp) 
    // In a production environment with multiple instances, a distributed cache like Redis should be used.
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    public String generateAndSendOtp(String email) {
        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStore.put(email, otp);

        // Send OTP via Gmail SMTP
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Kapoor & Associates — Admin Login OTP");
        message.setText(
            "Dear Admin,\n\n" +
            "Your One-Time Password (OTP) for admin login is:\n\n" +
            "  " + otp + "\n\n" +
            "This OTP is valid for 10 minutes.\n" +
            "If you did not request this, please secure your account immediately.\n\n" +
            "Regards,\n" +
            "Kapoor & Associates Security System"
        );
        message.setFrom("kavyakapoor28i@gmail.com");

        mailSender.send(message);
        System.out.println("✅ OTP sent to: " + email);
        return otp;
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
