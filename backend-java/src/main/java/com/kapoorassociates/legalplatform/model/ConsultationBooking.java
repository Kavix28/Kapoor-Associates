package com.kapoorassociates.legalplatform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "consultation_bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(name = "company_name")
    private String companyName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(name = "legal_matter", nullable = false, columnDefinition = "TEXT")
    private String legalMatter;

    @Column(name = "consultation_type")
    @Builder.Default
    private String consultationType = "office";

    @Column(name = "office_location")
    @Builder.Default
    private String officeLocation = "tis_hazari";

    @Column(nullable = false)
    private LocalDate preferredDate;

    @Column(nullable = false)
    private LocalTime preferredTime;

    @Builder.Default
    private String status = "pending";

    @Column(name = "meeting_status")
    @Builder.Default
    private String meetingStatus = "scheduled";

    @Column(name = "calendar_event_id")
    private String calendarEventId;

    @Column(name = "meeting_link", columnDefinition = "TEXT")
    private String meetingLink;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
