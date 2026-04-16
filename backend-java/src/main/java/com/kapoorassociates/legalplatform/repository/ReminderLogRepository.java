/**
 * Kapoor & Associates Legal Platform
 * Repository for Reminder Logs
 */
package com.kapoorassociates.legalplatform.repository;

import com.kapoorassociates.legalplatform.model.ReminderLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReminderLogRepository extends JpaRepository<ReminderLog, Long> {
    List<ReminderLog> findByClientIdOrderBySentAtDesc(UUID clientId);
    List<ReminderLog> findAllByOrderBySentAtDesc();
}
