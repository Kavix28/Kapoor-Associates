package com.kapoorassociates.legalplatform.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "pending_logins")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PendingLogin {
    @Id
    private String email;

    private String otp;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private Integer attempts = 0;
}
