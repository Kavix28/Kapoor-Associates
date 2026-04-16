package com.kapoorassociates.legalplatform.repository;

import com.kapoorassociates.legalplatform.model.ChatbotSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface ChatbotSessionRepository extends JpaRepository<ChatbotSession, UUID> {
    Optional<ChatbotSession> findBySessionId(UUID sessionId);
}
