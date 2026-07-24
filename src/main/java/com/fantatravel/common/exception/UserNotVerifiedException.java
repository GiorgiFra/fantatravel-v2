package com.fantatravel.common.exception;

public class UserNotVerifiedException extends RuntimeException {
    public UserNotVerifiedException() {
        super("User account is not verified.");
    }

    public UserNotVerifiedException(String message) {
        super(message);
    }
}
