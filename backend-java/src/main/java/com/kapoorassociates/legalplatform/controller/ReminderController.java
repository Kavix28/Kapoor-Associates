/**
 * Kapoor & Associates Legal Platform
 * Controller for managing reminders
 */
package com.kapoorassociates.legalplatform.controller;

import com.kapoorassociates.legalplatform.model.ReminderLog;
import com.kapoorassociates.legalplatform.repository.ReminderLogRepository;
import com.kapoorassociates.legalplatform.service.ReminderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/reminders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReminderController {

    private final ReminderService reminderService;
    private final ReminderLogRepository reminderLogRepository;

    @PostMapping("/trigger")
    public ResponseEntity<Map<String, Integer>> triggerReminders() {
        int hearings = reminderService.sendHearingReminders();
        int consultations = reminderService.sendConsultationReminders();
        return ResponseEntity.ok(Map.of(
            "hearingRemindersSent", hearings,
            "consultationRemindersSent", consultations
        ));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<ReminderLog>> getLogs(@RequestParam(required = false) UUID clientId) {
        if (clientId != null) {
            return ResponseEntity.ok(reminderLogRepository.findByClientIdOrderBySentAtDesc(clientId));
        }
        return ResponseEntity.ok(reminderLogRepository.findAllByOrderBySentAtDesc());
    }
}
