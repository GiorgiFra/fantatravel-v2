package com.fantatravel.backup.service;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;

@Service
@Slf4j
public class BackupService {

    @Value("${backup-path}")
    private String backupPath;
    private final JavaMailSender mailSender;

    public BackupService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendDatabaseBackup() throws MessagingException {
        String date = new SimpleDateFormat("dd/MM/yyyy").format(new Date());
        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo("alessandro.fazari@icloud.com");
        helper.setFrom("noreply@fantatravel.com");
        helper.setSubject("BACKUP DB DEL " + date);
        helper.setText("In allegato il backup del database del " + date);
        FileSystemResource file
                = new FileSystemResource(new File(backupPath));
        helper.addAttachment(Objects.requireNonNull(file.getFilename()), file);

        mailSender.send(message);
    }
}
