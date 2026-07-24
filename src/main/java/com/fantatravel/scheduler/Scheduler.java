package com.fantatravel.scheduler;

import com.fantatravel.backup.service.BackupService;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.DependsOn;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@AllArgsConstructor
public class Scheduler {

    private final BackupService backupService;

    @Async
    @Scheduled(cron = "${backup-cron}")
    public void sendBackup() throws MessagingException {
        backupService.sendDatabaseBackup();
    }

}
