package com.kapoorassociates.legalplatform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "case_documents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaseDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String documentType; // e.g., PETITION, ORDER, EVIDENCE

    @Column(nullable = false)
    private String fileUrl; // URL to the file in storage (e.g., S3, local directory)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private CaseRecord caseRecord;

    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();
}
