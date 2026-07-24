package com.fantatravel.security.controller;

import com.fantatravel.security.assembler.UserInfoModelAssembler;
import com.fantatravel.security.dto.AuthenticationRequest;
import com.fantatravel.security.dto.RefreshTokenRequest;
import com.fantatravel.security.representation.AuthenticationResponse;
import com.fantatravel.security.model.CustomUserDetails;
import com.fantatravel.security.representation.UserInfoModel;
import com.fantatravel.security.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserInfoModelAssembler userInfoModelAssembler;

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/userInfo")
    public ResponseEntity<UserInfoModel> userInfo() {
        return ResponseEntity.ok(
                userInfoModelAssembler.toUserInfo((CustomUserDetails) SecurityContextHolder
                        .getContext().getAuthentication().getPrincipal()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refresh(@RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request.getToken()));
    }

    @DeleteMapping("/logout")
    public ResponseEntity<Void> logout() {
        authService.logout();
        return ResponseEntity.ok().build();
    }
}
