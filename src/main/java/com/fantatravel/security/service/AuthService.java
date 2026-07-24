package com.fantatravel.security.service;

import com.fantatravel.common.exception.UserNotVerifiedException;
import com.fantatravel.security.SecurityUtils;
import com.fantatravel.security.dto.AuthenticationRequest;
import com.fantatravel.security.representation.AuthenticationResponse;
import com.fantatravel.user.model.User;
import com.fantatravel.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse login(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        if (!user.isVerified()) {
            throw new UserNotVerifiedException();
        }
        String accessToken = jwtService.generateAccessToken(user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        user.setToken(accessToken);
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return new AuthenticationResponse(accessToken, refreshToken);
    }

    public AuthenticationResponse refreshToken(String refreshToken) {
        String email = jwtService.extractEmail(refreshToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!jwtService.isValid(refreshToken, user.getEmail())) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        String newAccessToken = jwtService.generateAccessToken(user.getEmail());
        String newRefreshToken = jwtService.generateRefreshToken(user.getEmail());

        user.setToken(newAccessToken);
        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);

        return new AuthenticationResponse(newAccessToken, newRefreshToken);
    }

    public void logout() {

        User user = userRepository.findById(SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setToken(null);
        user.setRefreshToken(null);
        userRepository.save(user);
    }


}
