package com.kapoorassociates.legalplatform.repository;

import com.kapoorassociates.legalplatform.model.ChatbotConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ChatbotConversationRepository extends JpaRepository<ChatbotConversation, UUID> {
}
