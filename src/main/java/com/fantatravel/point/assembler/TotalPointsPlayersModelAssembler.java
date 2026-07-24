package com.fantatravel.point.assembler;

import com.fantatravel.point.representation.PointsUserModel;
import com.fantatravel.team.model.Team;
import com.fantatravel.travel.assembler.TravelUserModelAssembler;
import com.fantatravel.travel.model.Travel;
import com.fantatravel.travel.model.TravelSpecialCategory;
import com.fantatravel.travel.model.TravelUserRole;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@AllArgsConstructor
public class TotalPointsPlayersModelAssembler {

    private final TravelUserModelAssembler travelUserModelAssembler;

    public PointsUserModel toModel(Travel travel, Long travelUserId) {
        List<PointsUserModel> usersWithPoints = getTable(travel);

        return usersWithPoints.stream().filter(user -> user.getUser().getId().equals(travelUserId))
                .findFirst()
                .orElse(null);
    }


    public List<PointsUserModel> toModelList(Travel travel) {
        return getTable(travel);
    }

    private List<PointsUserModel> getTable(Travel travel) {
        List<PointsUserModel> usersWithPoints = travel.getTravelUsers().stream()
                .filter(tu -> tu.getRole().equals(TravelUserRole.PLAYER))
                .map(user -> {
                    Team team = user.getTeam();
                    AtomicInteger totalPoints = new AtomicInteger();
                    if (team != null) {
                        team.getTeamUsers().forEach(tu -> {
                            int points = tu.getTravelUser().getPoints().stream()
                                    .mapToInt(p -> p.getTravelRule().getValue())
                                    .sum();
                            points = tu.isCaptain() ? points * 2 : points;
                            totalPoints.addAndGet(points);
                        });
                        if(travel.isReviewed() && !travel.getTravelSpecialCategories().isEmpty()) {
                            team.getTeamSpecialCategories().forEach(teamSC -> {
                                        TravelSpecialCategory travelSpecialCategory = travel.getTravelSpecialCategories().stream().filter(travelSC -> travelSC.getId().equals(teamSC.getTravelSpecialCategory().getId()))
                                                .findFirst()
                                                .orElseThrow(() -> new EntityNotFoundException("Travel special category not found with id: " + teamSC.getId()));
                                        if (teamSC.getTravelUser() != null
                                                && travelSpecialCategory.getUser() != null
                                                && teamSC.getTravelUser().getId().equals(travelSpecialCategory.getUser().getId())) {
                                            totalPoints.addAndGet(10);
                                        } else if (teamSC.getTravelUser() == null && travelSpecialCategory.getUser() == null) {
                                            totalPoints.addAndGet(10);
                                        }
                                    }
                            );
                        }
                    }
                    return PointsUserModel.builder()
                            .user(travelUserModelAssembler.toModel(user))
                            .points(totalPoints.get())
                            .build();
                })
                .sorted((u1, u2) -> Integer.compare(u2.getPoints(), u1.getPoints()))
                .toList();

        // assegna posizione (1-based)
        for (int i = 0; i < usersWithPoints.size(); i++) {
            usersWithPoints.get(i).setPosition(i + 1);
        }
        return usersWithPoints;
    }


}
