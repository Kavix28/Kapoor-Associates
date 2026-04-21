package com.kapoorassociates.legalplatform.service;

import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.concurrent.CompletableFuture;

/**
 * Kapoor & Associates Legal Platform
 * Service for OTP handling via n8n external webhooks.
 * Replaces internal SMTP/JavaMailSender.
 */
@Service
public class OtpService {

    @Value("${n8n.webhook.send-otp}")
    private String sendOtpWebhook;

    @Value("${n8n.webhook.verify-otp}")
    private String verifyOtpWebhook;

    private final OkHttpClient httpClient = new OkHttpClient();

    @Async
    public CompletableFuture<Boolean> sendOtp(String email) {
        try {
            String jsonBody = "{\"email\": \"" + email + "\"}";

            RequestBody body = RequestBody.create(
                jsonBody, MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                .url(sendOtpWebhook)
                .header("Content-Type", "application/json")
                .post(body)
                .build();

            try (Response response = httpClient.newCall(request).execute()) {
                if (response.isSuccessful()) {
                    System.out.println("✅ OTP send request sent to n8n for: " + email);
                    return CompletableFuture.completedFuture(true);
                } else {
                    String responseBody = response.body() != null ?
                        response.body().string() : "no body";
                    System.err.println("❌ n8n send-otp error: " 
                        + response.code() + " — " + responseBody);
                    return CompletableFuture.completedFuture(false);
                }
            }
        } catch (Exception e) {
            System.err.println("❌ OTP send exception: " + e.getMessage());
            return CompletableFuture.completedFuture(false);
        }
    }

    public boolean verifyOtp(String email, String otp) {
        try {
            String jsonBody = "{\"email\": \"" + email 
                + "\", \"otp\": \"" + otp + "\"}";

            RequestBody body = RequestBody.create(
                jsonBody, MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                .url(verifyOtpWebhook)
                .header("Content-Type", "application/json")
                .post(body)
                .build();

            try (Response response = httpClient.newCall(request).execute()) {
                if (response.isSuccessful()) {
                    String responseBody = response.body() != null ?
                        response.body().string() : "{}";
                    System.out.println("✅ OTP verify response: " + responseBody);
                    // n8n returns success:true if OTP is valid
                    return responseBody.contains("\"success\":true") 
                        || responseBody.contains("\"valid\":true")
                        || responseBody.contains("\"status\":\"success\"");
                } else {
                    System.err.println("❌ n8n verify-otp error: " + response.code());
                    return false;
                }
            }
        } catch (Exception e) {
            System.err.println("❌ OTP verify exception: " + e.getMessage());
            return false;
        }
    }
}
