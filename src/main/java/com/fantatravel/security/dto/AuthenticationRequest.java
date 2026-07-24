package com.fantatravel.security.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AuthenticationRequest {
    @NotNull
    private String email;
    @NotNull
    private String password;
}
