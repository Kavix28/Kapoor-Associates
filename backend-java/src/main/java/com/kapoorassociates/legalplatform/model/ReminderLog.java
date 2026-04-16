/**
 * Kapoor & Associates Legal Platform
 * Model for Case and Consultation Reminders
 */
package com.kapoorassociates.legalplatform.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "reminder_logs")
public class ReminderLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID clientId;
    private UUID caseId;
    private UUID consultationId;

    @Enumerated(EnumType.STRING)
    private ReminderType reminderType;

    @Enumerated(EnumType.STRING)
    private ReminderChannel channel;

    private LocalDateTime sentAt;

    @Enumerated(EnumType.STRING)
    private ReminderStatus status;

    private String messagePreview;
}
