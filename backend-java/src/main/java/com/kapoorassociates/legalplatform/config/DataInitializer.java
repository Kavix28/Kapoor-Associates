package com.kapoorassociates.legalplatform.config;

import com.kapoorassociates.legalplatform.model.AvailableSlot;
import com.kapoorassociates.legalplatform.repository.AvailableSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AvailableSlotRepository slotRepository;
    private final com.kapoorassociates.legalplatform.repository.ClientRepository clientRepository;
    private final com.kapoorassociates.legalplatform.repository.CaseRecordRepository caseRecordRepository;
    private final com.kapoorassociates.legalplatform.repository.ConsultationBookingRepository consultationBookingRepository;
    private final com.kapoorassociates.legalplatform.repository.RevenueRepository revenueRepository;
    private final com.kapoorassociates.legalplatform.repository.CaseInsightRepository caseInsightRepository;

    @Override
    public void run(String... args) {
        LocalDate today = LocalDate.now();
        if (slotRepository.findAllByIsAvailableAndDateBetween(true, today, today.plusDays(30)).size() < 10) {
            seedAvailableSlots();
        }
        if (clientRepository.count() == 0) {
            seedClientsAndRelatedData();
        }
        if (revenueRepository.count() == 0) {
            seedRevenue();
        }
    }

    private void seedClientsAndRelatedData() {
        String[][] clientsData = {
            {"Rajesh Kumar", "rajesh.k@example.com", "+91 98765 43210", "Kumar Logistics"},
            {"Amitabh Sharma", "sharma.amit@outlook.com", "+91 88888 77777", null},
            {"Sunita Williams", "sunita.w@legalmail.com", "+91 77777 66666", "Williams & Co"}
        };

        for (String[] cData : clientsData) {
            com.kapoorassociates.legalplatform.model.Client client = clientRepository.save(com.kapoorassociates.legalplatform.model.Client.builder()
                    .name(cData[0])
                    .email(cData[1])
                    .phone(cData[2])
                    .companyName(cData[3])
                    .createdAt(java.time.LocalDateTime.now().minusMonths(2))
                    .build());

            caseRecordRepository.save(com.kapoorassociates.legalplatform.model.CaseRecord.builder()
                    .client(client)
                    .caseNumber("KAP-CN-" + (1000 + new java.util.Random().nextInt(9000)))
                    .title("Property Dispute - Sector " + (10 + new java.util.Random().nextInt(90)))
                    .caseType("Civil")
                    .status("IN_PROGRESS")
                    .description("Legal proceedings regarding ancestral property.")
                    .nextHearingDate(java.time.LocalDateTime.now().plusDays(15))
                    .build());

            caseRecordRepository.save(com.kapoorassociates.legalplatform.model.CaseRecord.builder()
                    .client(client)
                    .caseNumber("KAP-CN-" + (1000 + new java.util.Random().nextInt(9000)))
                    .title("Interim Recovery " + cData[0])
                    .caseType("Commercial")
                    .status("OPEN")
                    .description("Recovery of outstanding dues.")
                    .build());

            consultationBookingRepository.save(com.kapoorassociates.legalplatform.model.ConsultationBooking.builder()
                    .name(client.getName())
                    .email(client.getEmail())
                    .phone(client.getPhone())
                    .legalMatter("General legal inquiry about " + client.getCompanyName())
                    .preferredDate(LocalDate.now().minusDays(10))
                    .preferredTime(LocalTime.of(14, 0))
                    .status("CONFIRMED")
                    .build());

            consultationBookingRepository.save(com.kapoorassociates.legalplatform.model.ConsultationBooking.builder()
                    .name(client.getName())
                    .email(client.getEmail())
                    .phone(client.getPhone())
                    .legalMatter("Follow up on property matter")
                    .preferredDate(LocalDate.now().plusDays(5))
                    .preferredTime(LocalTime.of(11, 0))
                    .status("PENDING")
                    .build());
        }
    }

    private void seedAvailableSlots() {
        List<AvailableSlot> slots = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        // Seed slots for the next 30 days
        for (int i = 0; i < 30; i++) {
            LocalDate date = today.plusDays(i);
            
            // Skip weekends
            if (date.getDayOfWeek().getValue() >= 6) continue;

            // Morning slots
            slots.add(createSlot(date, LocalTime.of(11, 00), "tis_hazari"));
            slots.add(createSlot(date, LocalTime.of(12, 00), "tis_hazari"));
            
            // Afternoon slots
            slots.add(createSlot(date, LocalTime.of(14, 00), "preet_vihar"));
            slots.add(createSlot(date, LocalTime.of(15, 00), "preet_vihar"));
            slots.add(createSlot(date, LocalTime.of(16, 00), "preet_vihar"));
        }
        
        slotRepository.saveAll(slots);
        System.out.println("Seeded " + slots.size() + " available slots.");
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

    private com.kapoorassociates.legalplatform.model.Revenue createRevenue(java.util.UUID clientId, String desc, double amount, com.kapoorassociates.legalplatform.model.RevenueType type, LocalDate date) {
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
                .date(date)
                .timeSlot(time)
                .durationMinutes(30)
                .officeLocation(location)
                .consultationType("both")
                .isAvailable(true)
                .build();
    }
}
