/**
 * Kapoor & Associates Legal Platform
 * Controller for Case AI Insights
 */
package com.kapoorassociates.legalplatform.controller;

import com.kapoorassociates.legalplatform.model.CaseInsight;
import com.kapoorassociates.legalplatform.service.CaseInsightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/cases")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CaseInsightController {

    private final CaseInsightService insightService;

    @PostMapping("/{caseId}/insights")
    public ResponseEntity<CaseInsight> generateInsight(@PathVariable UUID caseId) {
        try {
            return ResponseEntity.ok(insightService.generateInsight(caseId));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{caseId}/insights")
    public ResponseEntity<List<CaseInsight>> getInsights(@PathVariable UUID caseId) {
        return ResponseEntity.ok(insightService.getInsightsForCase(caseId));
    }
}
