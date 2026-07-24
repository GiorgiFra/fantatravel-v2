package com.fantatravel.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UserConfirmationRequest {

    @NotBlank(message = "Confirmation code is required")
    @Size(min = 6, max = 6, message = "Confirmation code must be exactly 6 characters long")
    private String confirmationCode;

}
