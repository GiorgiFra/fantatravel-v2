package com.fantatravel.user.service;

import com.fantatravel.security.service.JwtService;
import com.fantatravel.user.dto.ResetPasswordRequest;
import com.fantatravel.user.model.PasswordResetToken;
import com.fantatravel.user.model.User;
import com.fantatravel.user.repository.PasswordResetTokenRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
@Slf4j
public class PasswordResetTokenService {
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final UserService userService;
    private final JwtService jwtService;

    @Value("${password.reset.url}")
    private String passwordResetUrl;

    public PasswordResetTokenService(PasswordResetTokenRepository passwordResetTokenRepository, PasswordEncoder passwordEncoder, JavaMailSender mailSender, UserService userService, JwtService jwtService) {
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
        this.userService = userService;
        this.jwtService = jwtService;
    }
    public void resetPasswordRequest(String email){
        try {
            User user = userService.findByEmail(email);
            PasswordResetToken passwordResetToken = PasswordResetToken.builder()
                    .user(user)
                    .token(jwtService.generateResetPasswordToken(user.getEmail()))
                    .expiryDate(java.time.LocalDateTime.now().plusHours(30))
                    .used(false)
                    .build();
            passwordResetTokenRepository.save(passwordResetToken);
            sendPasswordResetMail(user, passwordResetToken.getToken());
            log.info("Password reset request processed for email: {}", email);
        } catch (Exception e) {
            log.error("Error while processing password reset request for email: {}", email, e);
        }
    }

    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken token = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("invalid_token"));

        if (token.isUsed() || token.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
            throw new IllegalArgumentException("invalid_token");
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userService.save(user);

        token.setUsed(true);
        passwordResetTokenRepository.save(token);

        log.info("Password reset successfully for user: {}", user.getEmail());
    }
    private void sendPasswordResetMail(User user, String token) throws MessagingException {
        String resetLink = passwordResetUrl + "/"+ token;
        String htmlContent = """
                <p>Ciao %s,</p>
                <p>Hai richiesto il reset della password. Clicca il pulsante qui sotto per continuare:</p>
                <p><a href="%s" style="background-color:#1976d2;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Clicca qui per resettare la password</a></p>
                <p>Se non hai richiesto questa operazione, ignora questa email.</p>
                <p>Il link scadrà tra 30 minuti.</p>
                """.formatted(user.getFirstName(), resetLink);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(user.getEmail());
        helper.setSubject("Reset Password - Fantatravel");
        helper.setText(htmlContent, true); // true = interpreta HTML
        helper.setFrom("noreply@fantatravel.com");

        mailSender.send(message);
    }

}
