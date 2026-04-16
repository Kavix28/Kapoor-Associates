package com.kapoorassociates.legalplatform.repository;

import com.kapoorassociates.legalplatform.model.ConsultationBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;
import java.util.UUID;

public interface ConsultationBookingRepository extends JpaRepository<ConsultationBooking, UUID> {
    Optional<ConsultationBooking> findByEmailAndPreferredDateAndPreferredTime(String email, LocalDate date, LocalTime time);
    java.util.List<ConsultationBooking> findByPreferredDateBetweenOrderByPreferredDateAscPreferredTimeAsc(LocalDate start, LocalDate end);
    java.util.List<ConsultationBooking> findByEmailOrderByCreatedAtDesc(String email);
    long countByPreferredDateAfter(LocalDate date);
}
