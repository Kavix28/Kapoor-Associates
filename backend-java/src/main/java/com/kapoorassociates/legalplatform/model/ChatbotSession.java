package com.kapoorassociates.legalplatform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "chatbot_sessions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatbotSession {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "session_id", unique = true, nullable = false)
    private UUID sessionId;

    @Column(name = "message_count")
    private Integer messageCount = 0;

    @Column(name = "advice_count")
    private Integer adviceCount = 0;

    @Column(name = "is_locked")
    private Boolean isLocked = false;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_activity")
    private LocalDateTime lastActivity = LocalDateTime.now();
}
