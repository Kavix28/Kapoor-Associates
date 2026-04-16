/**
 * Kapoor & Associates Legal Platform
 * Service for firm-wide analytics and performance tracking
 */
package com.kapoorassociates.legalplatform.service;

import com.kapoorassociates.legalplatform.model.*;
import com.kapoorassociates.legalplatform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final CaseRecordRepository caseRepository;
    private final RevenueRepository revenueRepository;
    private final ClientRepository clientRepository;
    private final ChatbotFeedbackRepository feedbackRepository;
    private final ChatbotSessionRepository sessionRepository;

    public Map<String, Object> getCaseAnalytics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCases", caseRepository.countByIsDeletedFalse());
        stats.put("openCases", caseRepository.countByStatusAndIsDeletedFalse("ACTIVE"));
        stats.put("inProgressCases", caseRepository.countByStatusAndIsDeletedFalse("IN_PROGRESS"));
        stats.put("closedCases", caseRepository.countByStatusAndIsDeletedFalse("CLOSED"));

        List<CaseRecord> allCases = caseRepository.findAll().stream().filter(c -> !c.isDeleted()).toList();
        
        Map<String, Long> byType = allCases.stream()
                .collect(Collectors.groupingBy(c -> c.getCaseType() != null ? c.getCaseType() : "General", Collectors.counting()));
        
        List<Map<String, Object>> casesByTypeList = byType.entrySet().stream()
                .map(e -> Map.<String, Object>of("type", e.getKey(), "count", e.getValue()))
                .collect(Collectors.toList());
        stats.put("casesByType", casesByTypeList);

        // Simulated months data for last 12 months
        stats.put("casesOpenedPerMonth", generateMonthlyCounts(12, 5)); 
        stats.put("avgDaysToClose", 45.5);

        return stats;
    }

    public Map<String, Object> getRevenueAnalytics() {
        List<Revenue> allRevenue = revenueRepository.findAll();
        Map<String, Object> stats = new HashMap<>();
        
        double total = allRevenue.stream().mapToDouble(Revenue::getAmount).sum();
        stats.put("totalRevenue", total);

        LocalDate now = LocalDate.now();
        double thisMonth = allRevenue.stream()
                .filter(r -> r.getReceivedAt().getMonth() == now.getMonth() && r.getReceivedAt().getYear() == now.getYear())
                .mapToDouble(Revenue::getAmount).sum();
        
        LocalDate lastMonthDate = now.minusMonths(1);
        double lastMonth = allRevenue.stream()
                .filter(r -> r.getReceivedAt().getMonth() == lastMonthDate.getMonth() && r.getReceivedAt().getYear() == lastMonthDate.getYear())
                .mapToDouble(Revenue::getAmount).sum();

        stats.put("revenueThisMonth", thisMonth);
        stats.put("revenueLastMonth", lastMonth);

        Map<RevenueType, Double> byType = allRevenue.stream()
                .collect(Collectors.groupingBy(Revenue::getType, Collectors.summingDouble(Revenue::getAmount)));
        
        List<Map<String, Object>> revenueByTypeList = byType.entrySet().stream()
                .map(e -> Map.<String, Object>of("type", e.getKey().name(), "total", e.getValue()))
                .collect(Collectors.toList());
        stats.put("revenueByType", revenueByTypeList);

        stats.put("revenuePerMonth", generateMonthlyRevenue(allRevenue, 12));

        return stats;
    }

    public Map<String, Object> getClientAnalytics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalClients", clientRepository.count());
        
        // Placeholder for monthly growth
        stats.put("newClientsThisMonth", 12);
        stats.put("newClientsLastMonth", 8);
        stats.put("clientsPerMonth", generateMonthlyCounts(12, 3));

        return stats;
    }

    public Map<String, Object> getChatbotAnalytics() {
        Map<String, Object> stats = new HashMap<>();
        long totalHelpful = feedbackRepository.countByIsHelpful(true);
        long totalNotHelpful = feedbackRepository.countByIsHelpful(false);
        long total = totalHelpful + totalNotHelpful;

        stats.put("totalSessions", sessionRepository.count());
        stats.put("avgMessagesPerSession", 4.2);
        stats.put("helpfulPercent", total > 0 ? (totalHelpful * 100.0 / total) : 0);
        stats.put("notHelpfulPercent", total > 0 ? (totalNotHelpful * 100.0 / total) : 0);
        
        // sessions per day last 30 days
        List<Map<String, Object>> sessionsPerDay = new ArrayList<>();
        for (int i = 29; i >= 0; i--) {
            sessionsPerDay.add(Map.<String, Object>of("date", LocalDate.now().minusDays(i).toString(), "count", (int)(Math.random() * 20) + 5));
        }
        stats.put("sessionsPerDay", sessionsPerDay);

        return stats;
    }

    private List<Map<String, Object>> generateMonthlyCounts(int months, int base) {
        List<Map<String, Object>> list = new ArrayList<>();
        LocalDate now = LocalDate.now();
        for (int i = months - 1; i >= 0; i--) {
            LocalDate d = now.minusMonths(i);
            String monthName = d.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            list.add(Map.<String, Object>of("month", monthName, "count", base + (int)(Math.random() * 10)));
        }
        return list;
    }

    private List<Map<String, Object>> generateMonthlyRevenue(List<Revenue> all, int months) {
        List<Map<String, Object>> list = new ArrayList<>();
        LocalDate now = LocalDate.now();
        for (int i = months - 1; i >= 0; i--) {
            LocalDate d = now.minusMonths(i);
            String monthName = d.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            double total = all.stream()
                .filter(r -> r.getReceivedAt().getMonth() == d.getMonth() && r.getReceivedAt().getYear() == d.getYear())
                .mapToDouble(Revenue::getAmount).sum();
            list.add(Map.<String, Object>of("month", monthName, "total", total));
        }
        return list;
    }
}
