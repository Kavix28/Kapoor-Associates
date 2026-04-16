package com.kapoorassociates.legalplatform.repository;

import com.kapoorassociates.legalplatform.model.ChatbotFeedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ChatbotFeedbackRepository extends JpaRepository<ChatbotFeedback, UUID> {
    long countByIsHelpful(boolean isHelpful);
    Page<ChatbotFeedback> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
