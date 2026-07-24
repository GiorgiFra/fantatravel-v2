package com.fantatravel.user.service;

import com.fantatravel.destination.model.Destination;
import com.fantatravel.security.SecurityUtils;
import com.fantatravel.user.dto.UserConfirmationRequest;
import com.fantatravel.user.dto.UserRegistrationRequest;
import com.fantatravel.user.dto.UserUpdateRequest;
import com.fantatravel.user.model.User;
import com.fantatravel.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.mapstruct.control.MappingControl;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    private static final SecureRandom random = new SecureRandom();

    public User save(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public long registerUser(UserRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("EmailAlreadyInUse");
        }

        String confirmationCode = generateConfirmationCode();

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Hash della password
        user.setConfirmationCode(confirmationCode);
        userRepository.save(user);
        sendConfirmationEmail(user.getEmail(), confirmationCode);
        return user.getId();
    }

    @Transactional
    public User update(UserUpdateRequest request) {
        User user = findById(SecurityUtils.getCurrentUserId());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        return userRepository.save(user);
    }

    public void confirmationUser(Long id, UserConfirmationRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("UserNotFound"));
        if(user.getConfirmationCode().equals(request.getConfirmationCode())) {
            user.setVerified(true);
            user.setConfirmationCode(null);
        } else {
            throw new IllegalArgumentException("InvalidConfirmationCode");
        }
        userRepository.save(user);
    }

    public User changeLanguage(String language) {
        User user = userRepository.findById(SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new EntityNotFoundException("UserNotFound"));
        user.setPreferredLanguage(language);
        return userRepository.save(user);
    }

    public String getLanguage() {
        User user = userRepository.findById(SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new EntityNotFoundException("UserNotFound"));
        return user.getPreferredLanguage();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));
    }

    public User findUserConfirmationCode(String email) {
        User user = findByEmail(email);
        if(user.isVerified()) {
            throw new IllegalArgumentException("user_already_verified");
        }
        return user;
    }

    private String generateConfirmationCode() {
        int code = 100000 + random.nextInt(900000); // numero tra 100000 e 999999
        return String.valueOf(code);
    }

    private void sendConfirmationEmail(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setFrom("noreply@fantatravel.ovh");
        message.setSubject("Conferma la tua registrazione - Fantatravel");
        message.setText("🎉 Registrazione completata!\n"
                + "Benvenuto/a a bordo del Fantatravel!\n\n"
                + "Che tu stia partendo con noi o giocando da casa, il tuo destino è segnato: "
                + "vivrai (o assisterai) avventure epiche, situazioni assurde e momenti da immortalare… o dimenticare in fretta.\n\n"
                + "Prepara cuore, mente e senso dell’umorismo: la sfida è ufficialmente iniziata!\n\n"
                + "🔐 Il tuo codice di conferma è: " + code + "\n\n"
                + "Inseriscilo nell'app per completare la registrazione.\n\n"
                + "Se non hai effettuato questa registrazione, ignora questa email.\n\n"
                + "— Fantatravel Team");
        mailSender.send(message);
    }

}
