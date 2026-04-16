package com.kapoorassociates.legalplatform.repository;

import com.kapoorassociates.legalplatform.model.PendingLogin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PendingLoginRepository extends JpaRepository<PendingLogin, String> {
}
