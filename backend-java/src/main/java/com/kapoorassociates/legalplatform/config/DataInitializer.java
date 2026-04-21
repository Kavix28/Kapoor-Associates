package com.kapoorassociates.legalplatform.config;

import com.kapoorassociates.legalplatform.model.AvailableSlot;
import com.kapoorassociates.legalplatform.repository.AvailableSlotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import com.kapoorassociates.legalplatform.model.AdminUser;
import com.kapoorassociates.legalplatform.repository.AdminUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Kapoor & Associates Legal Platform
 * Seeds initial data (slots, demo clients, revenue) on startup.
 * Safe for both SQLite (dev) and PostgreSQL (prod) — handles unique constraint violations gracefully.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AvailableSlotRepository slotRepository;
    private final com.kapoorassociates.legalplatform.repository.ClientRepository clientRepository;
    private final com.kapoorassociates.legalplatform.repository.CaseRecordRepository caseRecordRepository;
    private final com.kapoorassociates.legalplatform.repository.ConsultationBookingRepository consultationBookingRepository;
    private final com.kapoorassociates.legalplatform.repository.RevenueRepository revenueRepository;
    private final com.kapoorassociates.legalplatform.repository.CaseInsightRepository caseInsightRepository;
    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        LocalDate today = LocalDate.now();
        long futureSlots = slotRepository.findAllByIsAvailableAndDateBetween(true, today, today.plusDays(30)).size();
        if (futureSlots < 10) {
            log.info("DataInitializer: Found {} future slots, seeding new ones...", futureSlots);
            seedAvailableSlots();
        } else {
            log.info("DataInitializer: {} future slots found — skipping seed.", futureSlots);
        }
        if (clientRepository.count() == 0) {
            seedClientsAndRelatedData();
        }
        if (revenueRepository.count() == 0) {
            seedRevenue();
        }
        if (adminUserRepository.count() == 0 || !adminUserRepository.existsByEmail("kavyakapoor28i@gmail.com")) {
            seedAdminUser();
        }
    }

    private void seedAdminUser() {
        // Delete old admin if exists
        adminUserRepository.findByEmail("admin@kapoorassociates.com")
            .ifPresent(adminUserRepository::delete);

        if (!adminUserRepository.existsByEmail("kavyakapoor28i@gmail.com")) {
            AdminUser admin = AdminUser.builder()
                    .email("kavyakapoor28i@gmail.com")
                    .passwordHash(passwordEncoder.encode("kAVYA@922829"))
                    .role("SUPER_ADMIN")
                    .isActive(true)
                    .build();
            adminUserRepository.save(admin);
            log.info("✅ New admin user seeded: kavyakapoor28i@gmail.com");
        }
    }

    private void seedClientsAndRelatedData() {
        String[][] clientsData = {
            {"Rajesh Kumar", "rajesh.k@example.com", "+91 98765 43210", "Kumar Logistics"},
            {"Amitabh Sharma", "sharma.amit@outlook.com", "+91 88888 77777", null},
            {"Sunita Williams", "sunita.w@legalmail.com", "+91 77777 66666", "Williams & Co"}
        };

        for (String[] cData : clientsData) {
            com.kapoorassociates.legalplatform.model.Client client = clientRepository.save(
                com.kapoorassociates.legalplatform.model.Client.builder()
                    .name(cData[0]).email(cData[1]).phone(cData[2]).companyName(cData[3])
                    .createdAt(java.time.LocalDateTime.now().minusMonths(2))
                    .build()
            );

            caseRecordRepository.save(com.kapoorassociates.legalplatform.model.CaseRecord.builder()
                .client(client)
                .caseNumber("KAP-CN-" + (1000 + new java.util.Random().nextInt(9000)))
                .title("Property Dispute - Sector " + (10 + new java.util.Random().nextInt(90)))
                .caseType("Civil").status("IN_PROGRESS")
                .description("Legal proceedings regarding ancestral property.")
                .nextHearingDate(java.time.LocalDateTime.now().plusDays(15)).build());

            caseRecordRepository.save(com.kapoorassociates.legalplatform.model.CaseRecord.builder()
                .client(client)
                .caseNumber("KAP-CN-" + (1000 + new java.util.Random().nextInt(9000)))
                .title("Interim Recovery " + cData[0])
                .caseType("Commercial").status("OPEN")
                .description("Recovery of outstanding dues.").build());

            consultationBookingRepository.save(com.kapoorassociates.legalplatform.model.ConsultationBooking.builder()
                .name(client.getName()).email(client.getEmail()).phone(client.getPhone())
                .legalMatter("General legal inquiry about " + client.getCompanyName())
                .preferredDate(LocalDate.now().minusDays(10)).preferredTime(LocalTime.of(14, 0))
                .status("CONFIRMED").build());

            consultationBookingRepository.save(com.kapoorassociates.legalplatform.model.ConsultationBooking.builder()
                .name(client.getName()).email(client.getEmail()).phone(client.getPhone())
                .legalMatter("Follow up on property matter")
                .preferredDate(LocalDate.now().plusDays(5)).preferredTime(LocalTime.of(11, 0))
                .status("PENDING").build());
        }
    }

    private void seedAvailableSlots() {
        LocalDate today = LocalDate.now();
        int seeded = 0;
        int skipped = 0;

        for (int i = 0; i < 30; i++) {
            LocalDate date = today.plusDays(i);

            // Skip weekends (Saturday=6, Sunday=7)
            if (date.getDayOfWeek().getValue() >= 6) continue;

            List<AvailableSlot> dailySlots = List.of(
                createSlot(date, LocalTime.of(11, 0), "tis_hazari"),
                createSlot(date, LocalTime.of(12, 0), "tis_hazari"),
                createSlot(date, LocalTime.of(14, 0), "preet_vihar"),
                createSlot(date, LocalTime.of(15, 0), "preet_vihar"),
                createSlot(date, LocalTime.of(16, 0), "preet_vihar")
            );

            for (AvailableSlot slot : dailySlots) {
                try {
                    slotRepository.save(slot);
                    seeded++;
                } catch (DataIntegrityViolationException e) {
                    // Slot already exists (unique constraint: date + time_slot + office_location) — skip safely
                    skipped++;
                }
            }
        }
        log.info("DataInitializer: Seeded {} new slots, skipped {} existing.", seeded, skipped);
    }

    private void seedRevenue() {
        List<com.kapoorassociates.legalplatform.model.Client> clients = clientRepository.findAll();
        if (clients.isEmpty()) return;

        com.kapoorassociates.legalplatform.model.Client c1 = clients.get(0);
        com.kapoorassociates.legalplatform.model.Client c2 = clients.size() > 1 ? clients.get(1) : c1;

        List<com.kapoorassociates.legalplatform.model.Revenue> revenues = List.of(
            createRevenue(c1.getId(), "Consultation Fee", 2500.0, com.kapoorassociates.legalplatform.model.RevenueType.CONSULTATION_FEE, LocalDate.now().minusDays(5)),
            createRevenue(c1.getId(), "Retainer Q1", 50000.0, com.kapoorassociates.legalplatform.model.RevenueType.RETAINER, LocalDate.now().minusMonths(1)),
            createRevenue(c2.getId(), "Court Filing Fee", 1500.0, com.kapoorassociates.legalplatform.model.RevenueType.FILING_FEE, LocalDate.now().minusDays(10)),
            createRevenue(c2.getId(), "Professional Advice", 10000.0, com.kapoorassociates.legalplatform.model.RevenueType.OTHER, LocalDate.now().minusMonths(2)),
            createRevenue(c1.getId(), "Retainer Q2", 50000.0, com.kapoorassociates.legalplatform.model.RevenueType.RETAINER, LocalDate.now().minusMonths(4)),
            createRevenue(c2.getId(), "Initial Consultation", 2500.0, com.kapoorassociates.legalplatform.model.RevenueType.CONSULTATION_FEE, LocalDate.now().minusMonths(3))
        );
        revenueRepository.saveAll(revenues);
    }

    private com.kapoorassociates.legalplatform.model.Revenue createRevenue(
            java.util.UUID clientId, String desc, double amount,
            com.kapoorassociates.legalplatform.model.RevenueType type, LocalDate date) {
        com.kapoorassociates.legalplatform.model.Revenue r = new com.kapoorassociates.legalplatform.model.Revenue();
        r.setClientId(clientId);
        r.setDescription(desc);
        r.setAmount(amount);
        r.setType(type);
        r.setReceivedAt(date);
        return r;
    }

    private AvailableSlot createSlot(LocalDate date, LocalTime time, String location) {
        return AvailableSlot.builder()
            .date(date).timeSlot(time).durationMinutes(30)
            .officeLocation(location).consultationType("both")
            .isAvailable(true)
            .build();
    }
}
