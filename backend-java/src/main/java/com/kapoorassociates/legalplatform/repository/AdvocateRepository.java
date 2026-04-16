package com.kapoorassociates.legalplatform.repository;

import com.kapoorassociates.legalplatform.model.Advocate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AdvocateRepository extends JpaRepository<Advocate, UUID> {
    List<Advocate> findAllByIsActiveOrderByDisplayOrderAsc(Boolean isActive);
}
