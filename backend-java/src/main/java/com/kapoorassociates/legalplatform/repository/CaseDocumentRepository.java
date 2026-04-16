package com.kapoorassociates.legalplatform.repository;

import com.kapoorassociates.legalplatform.model.CaseDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface CaseDocumentRepository extends JpaRepository<CaseDocument, UUID> {
}
