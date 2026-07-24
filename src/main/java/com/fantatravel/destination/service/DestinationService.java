package com.fantatravel.destination.service;

import com.fantatravel.destination.model.Destination;
import com.fantatravel.destination.repository.DestinationRepository;
import com.fantatravel.user.dto.UserRegistrationRequest;
import com.fantatravel.user.model.User;
import com.fantatravel.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class DestinationService {
    private final DestinationRepository destinationRepository;
    public List<Destination> findAll() {
        return destinationRepository.findAll();
    }
    public Destination findById(Long id) {
        return destinationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Destination not found with id: " + id));
    }
}
