package com.fantatravel.user.validator;

import com.fantatravel.user.annotation.PasswordMatches;
import com.fantatravel.user.dto.UserRegistrationRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, Object> {

    @Override
    public void initialize(PasswordMatches constraintAnnotation) {}

    @Override
    public boolean isValid(Object obj, ConstraintValidatorContext context) {
        if (obj instanceof UserRegistrationRequest user) {
            return user.getPassword() != null
                && user.getPasswordRepeat() != null 
                && user.getPassword().equals(user.getPasswordRepeat());
        }
        return true;
    }
}
