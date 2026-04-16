package com.kapoorassociates.legalplatform.controller;

import com.kapoorassociates.legalplatform.dto.ApiResponse;
import com.kapoorassociates.legalplatform.dto.BookingRequest;
import com.kapoorassociates.legalplatform.model.AvailableSlot;
import com.kapoorassociates.legalplatform.model.ConsultationBooking;
import com.kapoorassociates.legalplatform.repository.AvailableSlotRepository;
import com.kapoorassociates.legalplatform.repository.ConsultationBookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/consultation")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ConsultationController {

    private final ConsultationBookingRepository bookingRepository;
    private final AvailableSlotRepository slotRepository;

    @GetMapping("/available-slots")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAvailableSlots(
            @RequestParam(required = false) String date,
            @RequestParam(defaultValue = "both") String consultationType) {
        
        LocalDate startDate = date != null ? LocalDate.parse(date) : LocalDate.now();
        LocalDate endDate = startDate.plusDays(30);
        
        List<AvailableSlot> slots = slotRepository.findAllByIsAvailableAndDateBetween(true, startDate, endDate);
        
        // Group by date
        Map<String, List<Map<String, Object>>> slotsByDate = slots.stream()
                .collect(Collectors.groupingBy(
                        slot -> slot.getDate().toString(),
                        Collectors.mapping(slot -> {
                            Map<String, Object> map = new HashMap<>();
                            map.put("id", slot.getId());
                            map.put("time", slot.getTimeSlot().toString());
                            map.put("duration", slot.getDurationMinutes());
                            map.put("officeLocation", slot.getOfficeLocation());
                            map.put("consultationType", slot.getConsultationType());
                            map.put("status", slot.getStatus().toString());
                            map.put("heldBySession", slot.getHeldBySession());
                            return map;
                        }, Collectors.toList())
                ));

        Map<String, Object> result = new HashMap<>();
        result.put("availableSlots", slotsByDate);
        result.put("totalSlots", slots.size());

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .data(result)
                .build());
    }

    @PostMapping("/book")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bookConsultation(@Valid @RequestBody BookingRequest request) {
        LocalDate date = LocalDate.parse(request.getPreferredDate());
        LocalTime time = LocalTime.parse(request.getPreferredTime());
        
        // 1. Check for duplicate booking
        Optional<ConsultationBooking> existing = bookingRepository.findByEmailAndPreferredDateAndPreferredTime(
                request.getEmail(), date, time);
        
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.<Map<String, Object>>builder()
                    .success(false)
                    .error("Duplicate booking")
                    .message("You already have a consultation booked for this time.")
                    .build());
        }

        // 2. Check if slot exists and is held by THIS session
        Optional<AvailableSlot> slotOpt = slotRepository.findById(UUID.fromString(request.getSlotId()));
        
        if (slotOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.<Map<String, Object>>builder()
                    .success(false)
                    .error("Slot not found")
                    .build());
        }

        AvailableSlot slot = slotOpt.get();

        // Security check: Only allow booking if HELD by the same sessionId
        if (slot.getStatus() != com.kapoorassociates.legalplatform.model.SlotStatus.HELD || 
            !request.getSessionId().equals(slot.getHeldBySession())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.<Map<String, Object>>builder()
                    .success(false)
                    .error("Slot not held by session")
                    .message("Please select the slot again before booking.")
                    .build());
        }

        // 3. Save booking
        ConsultationBooking booking = ConsultationBooking.builder()
                .name(request.getName())
                .companyName(request.getCompanyName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .legalMatter(request.getLegalMatter())
                .consultationType(request.getConsultationType())
                .officeLocation(request.getOfficeLocation())
                .preferredDate(date)
                .preferredTime(time)
                .status("confirmed")
                .build();
        
        ConsultationBooking saved = bookingRepository.save(booking);
        
        // 4. Update slot status to BOOKED
        slot.setIsAvailable(false);
        slot.setStatus(com.kapoorassociates.legalplatform.model.SlotStatus.BOOKED);
        slot.setHeldBySession(null);
        slot.setHeldAt(null);
        slotRepository.save(slot);

        Map<String, Object> data = new HashMap<>();
        data.put("bookingId", saved.getId());
        data.put("confirmationNumber", saved.getId().toString().substring(0, 8).toUpperCase());

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Consultation booked successfully")
                .data(data)
                .build());
    }
}
