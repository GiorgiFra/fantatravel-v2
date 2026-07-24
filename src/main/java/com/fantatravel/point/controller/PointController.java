package com.fantatravel.point.controller;

import com.fantatravel.point.assembler.*;
import com.fantatravel.point.dto.AddPointRequest;
import com.fantatravel.point.representation.NotSelectableTravelersModel;
import com.fantatravel.point.representation.PointsDayModel;
import com.fantatravel.point.representation.PointsUserModel;
import com.fantatravel.point.service.PointService;
import com.fantatravel.travel.service.TravelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/points")
@RequiredArgsConstructor
public class PointController {

    private final PointService pointService;
    private final TravelService travelService;
    private final PointsDayModelAssembler pointsDayModelAssembler;
    private final TotalPointsModelAssembler totalPointsModelAssembler;
    private final AddPointRequestAssembler addPointRequestAssembler;
    private final TotalPointsPlayersModelAssembler totalPointsPlayerModelAssembler;
    private final NotSelectableTravelersModelAssembler notSelectableTravelersModelAssembler;

    @PostMapping
    public ResponseEntity<Void> add(@RequestBody @Valid AddPointRequest request) {
        pointService.addPoint(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<PointsDayModel>> getPoints(@RequestParam("travelId") Long travelId) {
        return ResponseEntity.ok(pointsDayModelAssembler.toModelList(travelService.findById(travelId)));
    }

    @GetMapping("/total")
    public ResponseEntity<List<PointsUserModel>> getTotalPoints(@RequestParam("travelId") Long travelId) {
        return ResponseEntity.ok(totalPointsModelAssembler.toModelList(travelService.findById(travelId)));
    }

    @GetMapping("/total/players")
    public ResponseEntity<List<PointsUserModel>> getTotalPointsPlayers(@RequestParam("travelId") Long travelId) {
        return ResponseEntity.ok(totalPointsPlayerModelAssembler.toModelList(travelService.findById(travelId)));
    }

    @GetMapping("/{day}")
    public ResponseEntity<AddPointRequest> getPoints(@PathVariable("day") LocalDate day, @RequestParam("travelId") Long travelId) {
        return ResponseEntity.ok(addPointRequestAssembler.toModel(travelService.findById(travelId), day));
    }


    @GetMapping("/notSelectableTravelers/{day}")
    public ResponseEntity<List<NotSelectableTravelersModel>> getNotSelectableUser(@PathVariable("day") LocalDate day, @RequestParam("travelId") Long travelId) {
        return ResponseEntity.ok(notSelectableTravelersModelAssembler.toModelList(travelService.findById(travelId).getTravelRules(), day));
    }
}
