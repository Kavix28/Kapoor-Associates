/**
 * Kapoor & Associates Legal Platform
 * Repository for Revenue
 */
package com.kapoorassociates.legalplatform.repository;

import com.kapoorassociates.legalplatform.model.Revenue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface RevenueRepository extends JpaRepository<Revenue, Long> {
    List<Revenue> findByClientIdOrderByReceivedAtDesc(UUID clientId);
    List<Revenue> findAllByOrderByReceivedAtDesc();
    List<Revenue> findByReceivedAtBetween(LocalDate start, LocalDate end);
}
