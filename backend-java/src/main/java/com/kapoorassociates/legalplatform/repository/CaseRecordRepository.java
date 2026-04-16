package com.kapoorassociates.legalplatform.repository;

import com.kapoorassociates.legalplatform.model.CaseRecord;
import com.kapoorassociates.legalplatform.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CaseRecordRepository extends JpaRepository<CaseRecord, UUID> {
    List<CaseRecord> findByClientAndIsDeletedFalse(Client client);
    long countByIsDeletedFalse();
    long countByStatusAndIsDeletedFalse(String status);
}
