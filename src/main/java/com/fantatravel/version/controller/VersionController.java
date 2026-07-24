package com.fantatravel.version.controller;


import com.fantatravel.version.representation.BuildInfoModel;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/version")
public class VersionController {

    @Value("${version}")
    private String version;

    @GetMapping
    @Operation(summary = "Version", tags = "Version")
    public ResponseEntity<BuildInfoModel> getVersion() {
        return ResponseEntity.ok().body(BuildInfoModel.builder().version(version).build());
    }
}
