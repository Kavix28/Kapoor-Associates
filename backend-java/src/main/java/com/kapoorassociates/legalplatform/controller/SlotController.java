package com.kapoorassociates.legalplatform.controller;

import com.kapoorassociates.legalplatform.model.AvailableSlot;
import com.kapoorassociates.legalplatform.model.SlotStatus;
import com.kapoorassociates.legalplatform.repository.AvailableSlotRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Controller for managing consultation slot availability and reservation (locking).
 */
@RestController
@RequestMapping("/api/slots")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class SlotController {

    @Autowired
    private AvailableSlotRepository slotRepository;

    @PostMapping("/hold")
    public ResponseEntity<?> holdSlot(@RequestBody SlotRequest request) {
        Optional<AvailableSlot> slotOpt = slotRepository.findById(request.getSlotId());
        
        if (slotOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Slot not found");
        }

        AvailableSlot slot = slotOpt.get();

        // Check if already held or booked
        if (slot.getStatus() != SlotStatus.AVAILABLE) {
            // Check if it's already held by the SAME session (allow refreshing/re-holding)
            if (slot.getStatus() == SlotStatus.HELD && request.getSessionId().equals(slot.getHeldBySession())) {
                slot.setHeldAt(LocalDateTime.now());
                slotRepository.save(slot);
                return ResponseEntity.ok("Hold refreshed");
            }
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Slot is already held or booked");
        }

        // Apply hold
        slot.setStatus(SlotStatus.HELD);
        slot.setHeldAt(LocalDateTime.now());
        slot.setHeldBySession(request.getSessionId());
        slotRepository.save(slot);

        return ResponseEntity.ok("Slot held successfully");
    }

    @PostMapping("/release")
    public ResponseEntity<?> releaseSlot(@RequestBody SlotRequest request) {
        Optional<AvailableSlot> slotOpt = slotRepository.findById(request.getSlotId());
        
        if (slotOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Slot not found");
        }

        AvailableSlot slot = slotOpt.get();

        // Only release if held by the same session
        if (slot.getStatus() == SlotStatus.HELD && request.getSessionId().equals(slot.getHeldBySession())) {
            slot.setStatus(SlotStatus.AVAILABLE);
            slot.setHeldBySession(null);
            slot.setHeldAt(null);
            slotRepository.save(slot);
            return ResponseEntity.ok("Slot released successfully");
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission to release this slot");
    }

    @Data
    public static class SlotRequest {
        private UUID slotId;
        private String sessionId;
    }
}
