/**
 * Kapoor & Associates Legal Platform
 * Service for sending automated hearing and consultation reminders via n8n
 */
package com.kapoorassociates.legalplatform.service;

import com.kapoorassociates.legalplatform.model.*;
import com.kapoorassociates.legalplatform.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReminderService {

    private final CaseRecordRepository caseRecordRepository;
    private final ConsultationBookingRepository consultationRepository;
    private final ReminderLogRepository reminderLogRepository;
    private final ObjectMapper objectMapper;

    private static final String N8N_REMINDER_URL = "http://localhost:5678/webhook/send-reminder";
    private static final String N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOGEwNjE0Zi05NjNiLTQ1M2UtYjM3My1iMmNiYWIzZDdiMDciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQ0ODA3ODI3fQ.hDKVNKnDuzW3b25bh6EHsfd3r5efenG69xiuwq12o7s";

    public int sendHearingReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<CaseRecord> cases = caseRecordRepository.findAll().stream()
                .filter(c -> !c.isDeleted() && c.getNextHearingDate() != null && 
                             c.getNextHearingDate().toLocalDate().equals(tomorrow))
                .toList();

        int sentCount = 0;
        for (CaseRecord caseRecord : cases) {
            try {
                Client client = caseRecord.getClient();
                Map<String, String> payload = Map.of(
                    "type", "HEARING",
                    "clientName", client.getName(),
                    "clientPhone", client.getPhone(),
                    "clientEmail", client.getEmail(),
                    "caseTitle", caseRecord.getTitle(),
                    "hearingDate", tomorrow.toString(),
                    "hearingTime", "As scheduled"
                );

                sendToN8n(payload);

                logReminder(client.getId(), caseRecord.getId(), null, ReminderType.HEARING, "Reminder for Hearing: " + caseRecord.getTitle());
                sentCount++;
            } catch (Exception e) {
                log.error("Failed to send hearing reminder for case: " + caseRecord.getId(), e);
                logFailure(caseRecord.getClient().getId(), caseRecord.getId(), null, ReminderType.HEARING, e.getMessage());
            }
        }
        return sentCount;
    }

    public int sendConsultationReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<ConsultationBooking> bookings = consultationRepository.findByPreferredDateBetweenOrderByPreferredDateAscPreferredTimeAsc(tomorrow, tomorrow).stream()
                .filter(b -> "confirmed".equalsIgnoreCase(b.getStatus()))
                .toList();

        int sentCount = 0;
        for (ConsultationBooking booking : bookings) {
            try {
                Map<String, String> payload = Map.of(
                    "type", "CONSULTATION",
                    "clientName", booking.getName(),
                    "clientPhone", booking.getPhone(),
                    "clientEmail", booking.getEmail(),
                    "slotDate", booking.getPreferredDate().toString(),
                    "slotTime", booking.getPreferredTime().toString()
                );

                sendToN8n(payload);

                // For consultation reminders, we don't always have a Client object in the model (based on ConsultationBooking structure)
                // but we can try to find one by email if needed. For now, using null if not explicitly linked.
                logReminder(null, null, booking.getId(), ReminderType.CONSULTATION, "Reminder for Consultation: " + booking.getName());
                sentCount++;
            } catch (Exception e) {
                log.error("Failed to send consultation reminder for booking: " + booking.getId(), e);
                logFailure(null, null, booking.getId(), ReminderType.CONSULTATION, e.getMessage());
            }
        }
        return sentCount;
    }

    private void sendToN8n(Map<String, String> payload) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        String jsonPayload = objectMapper.writeValueAsString(payload);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(N8N_REMINDER_URL))
                .header("Content-Type", "application/json")
                .header("X-N8N-API-KEY", N8N_API_KEY)
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("n8n responded with status " + response.statusCode());
        }
    }

    private void logReminder(java.util.UUID clientId, java.util.UUID caseId, java.util.UUID consultationId, ReminderType type, String preview) {
        ReminderLog logEntry = new ReminderLog();
        logEntry.setClientId(clientId);
        logEntry.setCaseId(caseId);
        logEntry.setConsultationId(consultationId);
        logEntry.setReminderType(type);
        logEntry.setChannel(ReminderChannel.EMAIL); // Defaulting to EMAIL for logs, actual might be multi-channel
        logEntry.setSentAt(LocalDateTime.now());
        logEntry.setStatus(ReminderStatus.SENT);
        logEntry.setMessagePreview(preview);
        reminderLogRepository.save(logEntry);
    }

    private void logFailure(java.util.UUID clientId, java.util.UUID caseId, java.util.UUID consultationId, ReminderType type, String error) {
        ReminderLog logEntry = new ReminderLog();
        logEntry.setClientId(clientId);
        logEntry.setCaseId(caseId);
        logEntry.setConsultationId(consultationId);
        logEntry.setReminderType(type);
        logEntry.setSentAt(LocalDateTime.now());
        logEntry.setStatus(ReminderStatus.FAILED);
        logEntry.setMessagePreview("Error: " + (error.length() > 200 ? error.substring(0, 200) : error));
        reminderLogRepository.save(logEntry);
    }
}
