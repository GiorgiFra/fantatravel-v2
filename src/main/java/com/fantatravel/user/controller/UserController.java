package com.fantatravel.user.controller;

import com.fantatravel.security.assembler.UserInfoModelAssembler;
import com.fantatravel.security.model.CustomUserDetails;
import com.fantatravel.security.representation.UserInfoModel;
import com.fantatravel.user.dto.UserConfirmationRequest;
import com.fantatravel.user.dto.UserUpdateRequest;
import com.fantatravel.user.dto.UserRegistrationRequest;
import com.fantatravel.user.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private final UserInfoModelAssembler userInfoModelAssembler;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Long> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        long id = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(id);
    }

    @PostMapping("/update")
    public ResponseEntity<UserInfoModel> registerUser(@Valid @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(
                userInfoModelAssembler.toUserInfo((userService.update(request))));
    }

    @PostMapping("/confirm/{id}")
    public ResponseEntity<String> confirmUser(@PathVariable("id") Long id, @Valid @RequestBody UserConfirmationRequest request) {
        userService.confirmationUser(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body("User confirmation successfully");
    }

    @PatchMapping("/language/{language}")
    public ResponseEntity<UserInfoModel> changeLanguage(@PathVariable("language") String language) {
        return ResponseEntity.ok(userInfoModelAssembler.toUserInfo(userService.changeLanguage(language)));
    }

    @GetMapping("/language")
    public ResponseEntity<String> getLanguage() {
        return ResponseEntity.ok( userService.getLanguage());
    }


    @GetMapping("/find-user-confirmation")
    public ResponseEntity<UserInfoModel> redirectToCodeConfirmation(@RequestParam("email") String email) {
        return ResponseEntity.ok(userInfoModelAssembler.toUserInfo(userService.findUserConfirmationCode(email)));
    }

}
