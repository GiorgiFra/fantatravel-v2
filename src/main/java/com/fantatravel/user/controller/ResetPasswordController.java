package com.fantatravel.user.controller;

import com.fantatravel.security.assembler.UserInfoModelAssembler;
import com.fantatravel.security.representation.UserInfoModel;
import com.fantatravel.user.dto.ResetPasswordRequest;
import com.fantatravel.user.dto.UserConfirmationRequest;
import com.fantatravel.user.dto.UserRegistrationRequest;
import com.fantatravel.user.dto.UserUpdateRequest;
import com.fantatravel.user.service.PasswordResetTokenService;
import com.fantatravel.user.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/reset-password")
@AllArgsConstructor
public class ResetPasswordController {

    private final PasswordResetTokenService passwordResetTokenService;

    @PostMapping("/request")
    public ResponseEntity<Void> sendMailResetPassword(@RequestParam("email") String email) {
        passwordResetTokenService.resetPasswordRequest(email);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping
    public ResponseEntity<Void> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        passwordResetTokenService.resetPassword(request);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
