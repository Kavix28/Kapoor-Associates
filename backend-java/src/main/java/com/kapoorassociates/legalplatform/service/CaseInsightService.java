/**
 * Kapoor & Associates Legal Platform
 * Service for generating AI Case Insights via n8n
 */
package com.kapoorassociates.legalplatform.service;

import com.kapoorassociates.legalplatform.model.CaseInsight;
import com.kapoorassociates.legalplatform.model.CaseRecord;
import com.kapoorassociates.legalplatform.repository.CaseInsightRepository;
import com.kapoorassociates.legalplatform.repository.CaseRecordRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CaseInsightService {

    private final CaseInsightRepository insightRepository;
    private final CaseRecordRepository caseRepository;
    private final ObjectMapper objectMapper;

    private static final String N8N_WEBHOOK_URL = "http://localhost:5678/webhook/groq-case-insight";
    private static final String N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOGEwNjE0Zi05NjNiLTQ1M2UtYjM3My1iMmNiYWIzZDdiMDciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQ0ODA3ODI3fQ.hDKVNKnDuzW3b25bh6EHsfd3r5efenG69xiuwq12o7s";

    public CaseInsight generateInsight(UUID caseId) throws Exception {
        CaseRecord caseRecord = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found: " + caseId));

        String prompt = String.format(
            "Case Title: %s\nType: %s\nStatus: %s\nNext Hearing: %s\nAdvocate Notes: %s\nTask: Summarize this case and suggest 3 concrete legal next steps.",
            caseRecord.getTitle(), caseRecord.getCaseType(), caseRecord.getStatus(),
            caseRecord.getNextHearingDate() != null ? caseRecord.getNextHearingDate().toString() : "Not scheduled",
            caseRecord.getAdvocateNotes() != null ? caseRecord.getAdvocateNotes() : "No notes"
        );

        HttpClient client = HttpClient.newHttpClient();
        Map<String, String> payload = Map.of("prompt", prompt);
        String jsonPayload = objectMapper.writeValueAsString(payload);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(N8N_WEBHOOK_URL))
                .header("Content-Type", "application/json")
                .header("X-N8N-API-KEY", N8N_API_KEY)
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Failed to reach n8n: " + response.body());
        }

        Map<String, String> result = objectMapper.readValue(response.body(), Map.class);
        
        CaseInsight insight = new CaseInsight();
        insight.setCaseId(caseId);
        insight.setSummary(result.get("summary"));
        insight.setSuggestedNextSteps(result.get("suggestedNextSteps"));
        insight.setModelUsed(result.getOrDefault("modelUsed", "llama3-70b-8192"));
        insight.setGeneratedAt(LocalDateTime.now());

        return insightRepository.save(insight);
    }

    public List<CaseInsight> getInsightsForCase(UUID caseId) {
        return insightRepository.findByCaseIdOrderByGeneratedAtDesc(caseId);
    }
}
