package com.fantatravel.user.dto;
import com.fantatravel.user.annotation.PasswordMatches;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
@PasswordMatches
public class ResetPasswordRequest {

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotBlank(message = "Password repeat is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String passwordRepeat;

    private String token;

}

