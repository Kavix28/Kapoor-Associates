/**
 * Kapoor & Associates Legal Platform
 * Model for Revenue tracking
 */
package com.kapoorassociates.legalplatform.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "revenue")
public class Revenue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID clientId;
    private UUID caseId;
    private String description;
    private Double amount;
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    private RevenueType type;

    private LocalDate receivedAt;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
