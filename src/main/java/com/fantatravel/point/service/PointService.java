package com.fantatravel.point.service;

import com.fantatravel.point.dto.AddPointRequest;
import com.fantatravel.point.dto.AddPointRuleUsersRequest;
import com.fantatravel.point.model.Point;
import com.fantatravel.point.repository.PointRepository;
import com.fantatravel.security.representation.UserInfoModel;
import com.fantatravel.team.model.TeamUser;
import com.fantatravel.travel.model.TravelRule;
import com.fantatravel.travel.model.TravelStatus;
import com.fantatravel.travel.representation.TravelUserModel;
import com.fantatravel.travel.service.TravelService;
import com.fantatravel.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class PointService {

    private final PointRepository pointRepository;
    private final TravelService travelService;
    private final UserService userService;

    @Transactional
    public void addPoint(AddPointRequest request) {
        // carico solo il viaggio per validare che esista
        var travel = travelService.findById(request.getTravelId());

        // Validate points can only be assigned during ACTIVE status
        if (travel.getStatus() != TravelStatus.ACTIVE) {
            throw new IllegalStateException("Points can only be assigned when travel is ACTIVE");
        }

        travel.getTravelRules().forEach(tr -> pointRepository.deleteByTravelRule_IdAndDay(tr.getId(), request.getDay()));
        for (AddPointRuleUsersRequest ruleUsers : request.getRules()) {
            Long travelRuleId = ruleUsers.getRule().getTravelRuleId();

            // cancello tutti i punti di quella regola per quel giorno (pulizia)

            for (TravelUserModel u : ruleUsers.getUsers()) {
                Long travelUserId = u.getId();

                // Validate repeatable rules: if rule is NOT repeatable, check it wasn't assigned before
                TravelRule travelRule = travel.getTravelRules().stream()
                        .filter(tr -> tr.getId().equals(travelRuleId))
                        .findFirst()
                        .orElseThrow(() -> new EntityNotFoundException("TravelRule not found: " + travelRuleId));

                if (!travelRule.isRepeatable()) {
                    // Check if this user already received this rule on ANY day
                    boolean alreadyAssigned = pointRepository.findByTravelRule_IdAndTravelUser_Id(travelRuleId, travelUserId)
                            .isPresent();

                    if (alreadyAssigned) {
                        throw new IllegalStateException(
                                String.format("Rule '%s' is not repeatable and was already assigned to this traveler",
                                        travelRule.getRule().getDescription()));
                    }
                }

                // creo il nuovo Point solo se non esiste già per questo giorno
                boolean exists = pointRepository.findByTravelRule_IdAndTravelUser_IdAndDay(travelRuleId, travelUserId, request.getDay())
                        .isPresent();

                if (!exists) {
                    // Qui devi recuperare TravelUser dall’utente e travel, presumo che UserService lo supporti
                    var travelUser = travel.getTravelUsers().stream()
                            .filter(tu -> tu.getId().equals(travelUserId))
                            .findFirst()
                            .orElseThrow(() -> new EntityNotFoundException("TravelUser non trovato per travelId: "
                                    + request.getTravelId() + " e userId: " + travelUserId));

                    Point point = Point.builder()
                            .travelRule(TravelRule.builder().id(travelRuleId).build())  // se vuoi puoi fare fetch, ma così va bene per salvarlo
                            .travelUser(travelUser)
                            .day(request.getDay())
                            .build();

                    pointRepository.save(point);
                }
            }
        }
    }
}
