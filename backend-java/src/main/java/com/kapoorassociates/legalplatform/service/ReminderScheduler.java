/**
 * Kapoor & Associates Legal Platform
 * Scheduler for automated reminders
 */
package com.kapoorassociates.legalplatform.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReminderScheduler {

    private final ReminderService reminderService;

    @Scheduled(cron = "0 0 9 * * *") // Daily at 9:00 AM
    public void runDailyReminders() {
        log.info("Starting daily automated reminders...");
        int hearingReminders = reminderService.sendHearingReminders();
        int consultationReminders = reminderService.sendConsultationReminders();
        log.info("Sent {} hearing reminders and {} consultation reminders.", hearingReminders, consultationReminders);
    }
}
