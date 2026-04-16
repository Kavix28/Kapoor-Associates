package com.kapoorassociates.legalplatform.controller;

import com.kapoorassociates.legalplatform.model.ConsultationBooking;
import com.kapoorassociates.legalplatform.repository.ConsultationBookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Controller for administrative consultation management.
 */
@RestController
@RequestMapping("/api/admin/consultations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminConsultationController {

    private final ConsultationBookingRepository consultationBookingRepository;

    @GetMapping
    public ResponseEntity<List<ConsultationBooking>> getConsultations(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        
        if (from != null && to != null) {
            return ResponseEntity.ok(consultationBookingRepository.findByPreferredDateBetweenOrderByPreferredDateAscPreferredTimeAsc(from, to));
        }
        return ResponseEntity.ok(consultationBookingRepository.findAll());
    }

    @PutMapping("/{bookingId}")
    public ResponseEntity<ConsultationBooking> updateConsultationStatus(
            @PathVariable UUID bookingId,
            @RequestBody Map<String, String> statusData) {
        
        ConsultationBooking booking = consultationBookingRepository.findById(bookingId).orElseThrow();
        booking.setStatus(statusData.get("status"));
        return ResponseEntity.ok(consultationBookingRepository.save(booking));
    }
}
