/**
 * Kapoor & Associates Legal Platform
 * Repository for Case AI Insights
 */
package com.kapoorassociates.legalplatform.repository;

import com.kapoorassociates.legalplatform.model.CaseInsight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CaseInsightRepository extends JpaRepository<CaseInsight, Long> {
    List<CaseInsight> findByCaseIdOrderByGeneratedAtDesc(UUID caseId);
}
