package com.fantatravel.destination.controller;

import com.fantatravel.destination.assembler.DestinationModelAssembler;
import com.fantatravel.destination.assembler.mapper.DestinationModelMapper;
import com.fantatravel.destination.representation.DestinationModel;
import com.fantatravel.destination.service.DestinationService;
import com.fantatravel.security.assembler.UserInfoModelAssembler;
import com.fantatravel.security.dto.AuthenticationRequest;
import com.fantatravel.security.dto.RefreshTokenRequest;
import com.fantatravel.security.model.CustomUserDetails;
import com.fantatravel.security.representation.AuthenticationResponse;
import com.fantatravel.security.representation.UserInfoModel;
import com.fantatravel.security.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
@RequiredArgsConstructor
public class DestinationController {

    private final DestinationService destinationService;
    private final DestinationModelAssembler destinationModelAssembler;

    @GetMapping
    public ResponseEntity<List<DestinationModel>> findAll() {
        return ResponseEntity.ok(destinationModelAssembler.toModelList(destinationService.findAll()));
    }

}
