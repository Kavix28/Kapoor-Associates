package com.kapoorassociates.legalplatform.repository;

import com.kapoorassociates.legalplatform.model.AvailableSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AvailableSlotRepository extends JpaRepository<AvailableSlot, UUID> {
    List<AvailableSlot> findAllByIsAvailableAndDateBetween(Boolean isAvailable, LocalDate startDate, LocalDate endDate);
    Optional<AvailableSlot> findByDateAndTimeSlotAndOfficeLocationAndIsAvailable(LocalDate date, LocalTime time, String officeLocation, Boolean isAvailable);
}
