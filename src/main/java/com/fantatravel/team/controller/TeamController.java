package com.fantatravel.team.controller;

import com.fantatravel.security.SecurityUtils;
import com.fantatravel.team.assembler.TeamModelAssembler;
import com.fantatravel.team.dto.CreateTeamRequest;
import com.fantatravel.team.service.TeamService;
import com.fantatravel.team.representation.TeamModel;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;
    private final TeamModelAssembler teamModelAssembler;

    @PostMapping("/create")
    public ResponseEntity<TeamModel> create(@RequestBody @Valid CreateTeamRequest request) {
        return ResponseEntity.ok(teamModelAssembler.toModel(
                teamService.createTeam(request), SecurityUtils.getCurrentUser()
        ));
    }

    @PostMapping("{id}/update")
    public ResponseEntity<TeamModel> create(@PathVariable("id") Long id, @RequestBody @Valid CreateTeamRequest request) {
        return ResponseEntity.ok(teamModelAssembler.toModel(
                teamService.updateTeam(id, request), SecurityUtils.getCurrentUser()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamModel> create(@PathVariable("id") Long id) {
        return ResponseEntity.ok(teamModelAssembler.toModel(
                teamService.findById(id), SecurityUtils.getCurrentUser()
        ));
    }
}
