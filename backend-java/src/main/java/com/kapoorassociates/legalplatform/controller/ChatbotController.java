package com.kapoorassociates.legalplatform.controller;

import com.kapoorassociates.legalplatform.dto.ApiResponse;
import com.kapoorassociates.legalplatform.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<Map<String, Object>>> chat(@RequestBody Map<String, String> request, @RequestHeader(value = "X-Forwarded-For", required = false) String ipAddress) {
        String message = request.get("message");
        String sessionIdStr = request.get("sessionId");
        String language = request.getOrDefault("language", "en");
        UUID sessionId = (sessionIdStr != null && !sessionIdStr.isEmpty()) ? UUID.fromString(sessionIdStr) : UUID.randomUUID();
        
        Map<String, Object> result = chatbotService.processMessage(message, sessionId, ipAddress != null ? ipAddress : "127.0.0.1", language);

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .data(result)
                .build());
    }

    @PostMapping("/feedback")
    public ResponseEntity<ApiResponse<String>> feedback(@RequestBody Map<String, Object> request) {
        // Log feedback or save to DB (omitted for brevity, just return success)
        return ResponseEntity.ok(ApiResponse.<String>builder().success(true).data("Feedback received").build());
    }
}
