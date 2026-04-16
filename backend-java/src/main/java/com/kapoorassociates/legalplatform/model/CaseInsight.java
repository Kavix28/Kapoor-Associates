/**
 * Kapoor & Associates Legal Platform
 * Model for Case AI Insights
 */
package com.kapoorassociates.legalplatform.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "case_insights")
public class CaseInsight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID caseId;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String suggestedNextSteps;

    private LocalDateTime generatedAt;

    private String modelUsed;
}
