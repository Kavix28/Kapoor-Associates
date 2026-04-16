package com.kapoorassociates.legalplatform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity to store user feedback on chatbot responses.
 */
@Entity
@Table(name = "chatbot_feedback")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatbotFeedback {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID sessionId;

    @Column(nullable = false)
    private UUID messageId;

    @Column(nullable = false)
    private boolean isHelpful;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
