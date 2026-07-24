package com.fantatravel.security;

import com.fantatravel.security.exception.UserNotFoundException;
import com.fantatravel.security.model.CustomUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Slf4j
public final class SecurityUtils {

    private SecurityUtils() {
        // Utility class, no instantiation
    }

    /**
     * Restituisce l'oggetto Authentication corrente, se presente.
     */
    public static Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    /**
     * Restituisce l'utente corrente autenticato, se presente.
     */
    public static CustomUserDetails getCurrentUser() {
        Authentication auth = getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails user) {
            return user;
        }
        throw new UserNotFoundException();
    }

    /**
     * Restituisce l'ID dell'utente corrente, se disponibile.
     */
    public static Long getCurrentUserId() {
        CustomUserDetails user = getCurrentUser();
        return user != null ? user.getId() : null;
    }

    /**
     * Restituisce il login/username dell'utente corrente, se disponibile.
     */
    public static String getCurrentUsername() {
        CustomUserDetails user = getCurrentUser();
        return user != null ? user.getUsername() : null;
    }
}
