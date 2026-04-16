/**
 * Kapoor & Associates Legal Platform
 * Controller for firm analytics
 */
package com.kapoorassociates.legalplatform.controller;

import com.kapoorassociates.legalplatform.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/cases")
    public ResponseEntity<Map<String, Object>> getCaseAnalytics() {
        return ResponseEntity.ok(analyticsService.getCaseAnalytics());
    }

    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueAnalytics() {
        return ResponseEntity.ok(analyticsService.getRevenueAnalytics());
    }

    @GetMapping("/clients")
    public ResponseEntity<Map<String, Object>> getClientAnalytics() {
        return ResponseEntity.ok(analyticsService.getClientAnalytics());
    }

    @GetMapping("/chatbot")
    public ResponseEntity<Map<String, Object>> getChatbotAnalytics() {
        return ResponseEntity.ok(analyticsService.getChatbotAnalytics());
    }
}
