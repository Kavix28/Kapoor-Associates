package com.kapoorassociates.legalplatform.service;

import com.kapoorassociates.legalplatform.model.AvailableSlot;
import com.kapoorassociates.legalplatform.model.SlotStatus;
import com.kapoorassociates.legalplatform.repository.AvailableSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service to automatically cleanup and release slots that have been held for too long.
 */
@Service
public class SlotCleanupService {

    @Autowired
    private AvailableSlotRepository slotRepository;

    /**
     * Runs every 5 minutes and releases slots held for more than 10 minutes.
     */
    @Scheduled(fixedRate = 300000) // 5 minutes in milliseconds
    @Transactional
    public void releaseExpiredHolds() {
        LocalDateTime expiryTime = LocalDateTime.now().minusMinutes(10);
        
        // Custom query logic to find HELD slots older than 10 mins
        List<AvailableSlot> expiredSlots = slotRepository.findAll().stream()
                .filter(slot -> slot.getStatus() == SlotStatus.HELD && 
                               slot.getHeldAt() != null && 
                               slot.getHeldAt().isBefore(expiryTime))
                .toList();

        if (!expiredSlots.isEmpty()) {
            for (AvailableSlot slot : expiredSlots) {
                slot.setStatus(SlotStatus.AVAILABLE);
                slot.setHeldBySession(null);
                slot.setHeldAt(null);
            }
            slotRepository.saveAll(expiredSlots);
            System.out.println("Released " + expiredSlots.size() + " expired slot holds.");
        }
    }
}
