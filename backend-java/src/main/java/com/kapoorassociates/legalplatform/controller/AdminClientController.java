package com.kapoorassociates.legalplatform.controller;

import com.kapoorassociates.legalplatform.model.CaseRecord;
import com.kapoorassociates.legalplatform.model.Client;
import com.kapoorassociates.legalplatform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Controller for admin-level client and case management.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminClientController {

    private final ClientRepository clientRepository;
    private final CaseRecordRepository caseRecordRepository;
    private final ConsultationBookingRepository consultationBookingRepository;
    private final CaseDocumentRepository caseDocumentRepository;
    private final ChatbotFeedbackRepository chatbotFeedbackRepository;

    @GetMapping("/clients")
    public ResponseEntity<List<Map<String, Object>>> getAllClients() {
        List<Map<String, Object>> response = clientRepository.findAll().stream().map(client -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", client.getId());
            map.put("name", client.getName());
            map.put("email", client.getEmail());
            map.put("phone", client.getPhone());
            map.put("createdAt", client.getCreatedAt());
            map.put("caseCount", caseRecordRepository.findByClientAndIsDeletedFalse(client).size());
            map.put("upcomingConsultations", consultationBookingRepository.countByPreferredDateAfter(LocalDate.now()));
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/clients/{clientId}")
    public ResponseEntity<Map<String, Object>> getClientProfile(@PathVariable UUID clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("profile", client);
        response.put("cases", caseRecordRepository.findByClientAndIsDeletedFalse(client));
        response.put("consultations", consultationBookingRepository.findByEmailOrderByCreatedAtDesc(client.getEmail()));
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/clients/{clientId}/cases")
    public ResponseEntity<CaseRecord> createCase(@PathVariable UUID clientId, @RequestBody Map<String, Object> data) {
        Client client = clientRepository.findById(clientId).orElseThrow();
        
        CaseRecord caseRecord = CaseRecord.builder()
                .caseNumber("KAP-" + System.currentTimeMillis() % 10000)
                .title((String) data.get("caseTitle"))
                .caseType((String) data.get("caseType"))
                .status((String) data.get("status"))
                .description((String) data.get("description"))
                .advocateNotes((String) data.get("advocateNotes"))
                .nextHearingDate(data.get("nextHearingDate") != null ? LocalDateTime.parse((String) data.get("nextHearingDate")) : null)
                .client(client)
                .build();
        
        return ResponseEntity.ok(caseRecordRepository.save(caseRecord));
    }

    @PutMapping("/clients/{clientId}/cases/{caseId}")
    public ResponseEntity<CaseRecord> updateCase(@PathVariable UUID clientId, @PathVariable UUID caseId, @RequestBody Map<String, Object> data) {
        CaseRecord caseRecord = caseRecordRepository.findById(caseId).orElseThrow();
        
        if (data.containsKey("status")) caseRecord.setStatus((String) data.get("status"));
        if (data.containsKey("nextHearingDate")) caseRecord.setNextHearingDate(data.get("nextHearingDate") != null ? LocalDateTime.parse((String) data.get("nextHearingDate")) : null);
        if (data.containsKey("advocateNotes")) caseRecord.setAdvocateNotes((String) data.get("advocateNotes"));
        caseRecord.setUpdatedAt(LocalDateTime.now());
        
        return ResponseEntity.ok(caseRecordRepository.save(caseRecord));
    }

    @DeleteMapping("/clients/{clientId}/cases/{caseId}")
    public ResponseEntity<Void> softDeleteCase(@PathVariable UUID clientId, @PathVariable UUID caseId) {
        CaseRecord caseRecord = caseRecordRepository.findById(caseId).orElseThrow();
        caseRecord.setDeleted(true);
        caseRecordRepository.save(caseRecord);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalClients", clientRepository.count());
        stats.put("totalCases", caseRecordRepository.countByIsDeletedFalse());
        stats.put("openCases", caseRecordRepository.countByStatusAndIsDeletedFalse("OPEN"));
        stats.put("inProgressCases", caseRecordRepository.countByStatusAndIsDeletedFalse("IN_PROGRESS"));
        stats.put("closedCases", caseRecordRepository.countByStatusAndIsDeletedFalse("CLOSED"));
        stats.put("totalConsultations", consultationBookingRepository.count());
        stats.put("upcomingConsultations", consultationBookingRepository.countByPreferredDateAfter(LocalDate.now()));
        stats.put("totalDocuments", caseDocumentRepository.count());
        stats.put("chatbotFeedbackHelpful", chatbotFeedbackRepository.countByIsHelpful(true));
        stats.put("chatbotFeedbackNotHelpful", chatbotFeedbackRepository.countByIsHelpful(false));
        return ResponseEntity.ok(stats);
    }
}
