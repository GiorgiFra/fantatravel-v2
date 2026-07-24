package com.fantatravel.security.audit;

import com.fantatravel.security.model.CustomUserDetails;
import com.fantatravel.user.model.User;
import com.fantatravel.user.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("auditorProvider")
@AllArgsConstructor
public class AuditorAwareImpl implements AuditorAware<User> {

    private final UserService userService;
    @Override
    public Optional<User> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof CustomUserDetails customUserDetails) {
            return Optional.of(userService.findById(customUserDetails.getId()));
        }


        return Optional.empty();
    }
}
