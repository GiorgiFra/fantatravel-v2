package com.fantatravel.travel.controller;

import com.fantatravel.rule.assembler.RuleModelAssembler;
import com.fantatravel.rule.representation.RuleModel;
import com.fantatravel.rule.service.RuleService;
import com.fantatravel.specialcategory.assembler.SpecialCategoryModelAssembler;
import com.fantatravel.specialcategory.representation.SpecialCategoryModel;
import com.fantatravel.specialcategory.service.SpecialCategoryService;
import com.fantatravel.travel.assembler.TravelModelAssembler;
import com.fantatravel.travel.assembler.TravelRuleModelAssembler;
import com.fantatravel.travel.assembler.TravelSpecialCategoryModelAssembler;
import com.fantatravel.travel.assembler.TravelUserModelAssembler;
import com.fantatravel.travel.dto.*;
import com.fantatravel.travel.model.TravelStatus;
import com.fantatravel.travel.model.Travel;
import com.fantatravel.travel.model.TravelUserRole;
import com.fantatravel.travel.representation.TravelModel;
import com.fantatravel.travel.representation.TravelUserModel;
import com.fantatravel.travel.service.TravelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/travels")
@RequiredArgsConstructor
public class TravelController {

    private final TravelService travelService;
    private final RuleService ruleService;
    private final SpecialCategoryService specialCategoryService;
    private final TravelModelAssembler travelModelAssembler;
    private final TravelUserModelAssembler travelUserAssembler;
    private final TravelRuleModelAssembler travelRuleModelAssembler;
    private final RuleModelAssembler ruleModelAssembler;
    private final TravelSpecialCategoryModelAssembler travelSpecialCategoryModelAssembler;
    private final SpecialCategoryModelAssembler specialCategoryModelAssembler;

    @GetMapping
    public ResponseEntity<List<TravelModel>> findAll() {
        return ResponseEntity.ok(travelModelAssembler.toModelList(travelService.findAllTravels()));
    }

    @GetMapping("/teams")
    public ResponseEntity<List<TravelModel>> findAllTeams() {
        return ResponseEntity.ok(travelModelAssembler.toModelList(travelService.findAllTeams()));
    }

    @PostMapping("/create")
    public ResponseEntity<TravelModel> create(@RequestBody @Valid CreateTravelRequest request) {
        return ResponseEntity.ok(travelModelAssembler.toModel(travelService.create(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TravelModel> create(@PathVariable("id") Long id) {
        return ResponseEntity.ok(travelModelAssembler.toModel(travelService.findById(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<TravelModel> delete(@PathVariable("id") Long id) {
        travelService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/link-rules")
    public ResponseEntity<TravelModel> linkRules(@PathVariable("id") Long id, @RequestBody @Valid LinkRuleTravelRequest request) {
        return ResponseEntity.ok(travelModelAssembler.toModel(travelService.linkRules(id, request)));
    }

    @PostMapping("/{id}/link-special-categories")
    public ResponseEntity<TravelModel> linkSpecialCategories(@PathVariable("id") Long id, @RequestBody @Valid LinkSpecialCategoryTravelRequest request) {
        return ResponseEntity.ok(travelModelAssembler.toModel(travelService.linkSpecialCategories(id, request)));
    }

    @PostMapping("/{id}/link-user")
    public ResponseEntity<Long> linkRules(@PathVariable("id") Long id, @RequestParam("userType") @Valid TravelUserRole role) {
        travelService.linkUserToTravel(id, role);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{id}/link-rules")
    public ResponseEntity<List<RuleModel>> getRulesToLink(@PathVariable("id") Long id) {
        Travel travel = travelService.findById(id);
        List<RuleModel> travelRules = travelRuleModelAssembler.toModelList(travel.getTravelRules());
        List<RuleModel> availableRules = ruleModelAssembler.toModelList(
                ruleService.findAllByDestinationId(travel.getDestination().getId()));
        Map<Long, RuleModel> travelMap = travelRules.stream()
                .collect(Collectors.toMap(RuleModel::getId, rule -> rule));

        List<RuleModel> merged = availableRules.stream()
                .map(rule -> travelMap.getOrDefault(rule.getId(), rule))
                .collect(Collectors.toList());

        travelRules.stream()
                .filter(trRule -> !travelMap.containsKey(trRule.getId())
                        || merged.stream().noneMatch(r -> r.getId().equals(trRule.getId())))
                .forEach(merged::add);
        return ResponseEntity.ok(merged);
    }

    @GetMapping("/{id}/link-special-categories")
    public ResponseEntity<List<SpecialCategoryModel>> getSpecialCategoriesToLink(@PathVariable("id") Long id) {
        Travel travel = travelService.findById(id);
        List<SpecialCategoryModel> specialCategoryModels = travelSpecialCategoryModelAssembler.toModelList(travel.getTravelSpecialCategories());
        List<SpecialCategoryModel> availableSpecialCategories = specialCategoryModelAssembler.toModelList(
                specialCategoryService.findAll());
        Map<Long, SpecialCategoryModel> travelMap = specialCategoryModels.stream()
                .collect(Collectors.toMap(SpecialCategoryModel::getId, tsc -> tsc));

        List<SpecialCategoryModel> merged = availableSpecialCategories.stream()
                .map(sc -> travelMap.getOrDefault(sc.getId(), sc))
                .collect(Collectors.toList());

        specialCategoryModels.stream()
                .filter(tsc -> !travelMap.containsKey(tsc.getId())
                        || merged.stream().noneMatch(sc -> sc.getId().equals(tsc.getId())))
                .forEach(merged::add);
        return ResponseEntity.ok(merged);
    }



    @GetMapping("/{id}/travelers")
    public ResponseEntity<List<TravelUserModel>> getAllTravelers(@PathVariable("id") Long id) {
        return ResponseEntity.ok(travelUserAssembler.toModelList(travelService.getAllTravelers(id)));
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<TravelModel> review(@PathVariable("id") Long id, @RequestBody @Valid ReviewedTravelRequest request) {
        return ResponseEntity.ok(travelModelAssembler.toModel(travelService.review(id, request)));
    }

    @GetMapping("/{id}/special-categories")
    public ResponseEntity<List<SpecialCategoryModel>> getSpecialCategories(@PathVariable("id") Long id) {
        Travel travel = travelService.findById(id);
        return ResponseEntity.ok(travelSpecialCategoryModelAssembler.toModelList(travel.getTravelSpecialCategories()));
    }

    /**
     * Generate invite link for a travel
     */
    @PostMapping("/{id}/invite-link")
    public ResponseEntity<InviteLinkResponse> generateInviteLink(@PathVariable("id") Long id) {
        Travel travel = travelService.findById(id);
        String inviteUrl = travelService.generateInviteLink(id);
        return ResponseEntity.ok(InviteLinkResponse.builder()
                .inviteUrl(inviteUrl)
                .inviteToken(travel.getInviteToken())
                .build());
    }

    /**
     * Join a travel using invite token
     */
    @PostMapping("/join")
    public ResponseEntity<TravelModel> joinTravel(@RequestBody @Valid JoinTravelRequest request) {
        Travel travel = travelService.joinTravelByToken(request.getInviteToken());
        return ResponseEntity.ok(travelModelAssembler.toModel(travel));
    }

    /**
     * Start travel: freeze rules and set status to ACTIVE
     */
    @PostMapping("/{id}/start")
    public ResponseEntity<TravelModel> startTravel(@PathVariable("id") Long id) {
        Travel travel = travelService.startTravel(id);
        return ResponseEntity.ok(travelModelAssembler.toModel(travel));
    }

    /**
     * Complete travel: allow special category assignment
     */
    @PostMapping("/{id}/complete")
    public ResponseEntity<TravelModel> completeTravel(@PathVariable("id") Long id) {
        Travel travel = travelService.completeTravel(id);
        return ResponseEntity.ok(travelModelAssembler.toModel(travel));
    }

    /**
     * Mark traveler as abandoned and apply -100 malus
     */
    @PostMapping("/{id}/travelers/{travelUserId}/abandon")
    public ResponseEntity<Void> abandonTraveler(
            @PathVariable("id") Long id,
            @PathVariable("travelUserId") Long travelUserId) {
        travelService.abandonTraveler(id, travelUserId);
        return ResponseEntity.ok().build();
    }

}
