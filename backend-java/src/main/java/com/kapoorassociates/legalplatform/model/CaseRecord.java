package com.kapoorassociates.legalplatform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "case_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaseRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String caseNumber;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private String status; // e.g., ACTIVE, CLOSED, PENDING

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @OneToMany(mappedBy = "caseRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CaseDocument> documents = new ArrayList<>();

    private String caseType;

    private LocalDateTime nextHearingDate;

    @Column(length = 2000)
    private String advocateNotes;

    @Builder.Default
    private boolean isDeleted = false;

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
