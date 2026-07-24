package com.fantatravel.point.assembler;

import com.fantatravel.point.representation.PointsDayModel;
import com.fantatravel.point.representation.PointsUserModel;
import com.fantatravel.security.SecurityUtils;
import com.fantatravel.security.model.CustomUserDetails;
import com.fantatravel.travel.assembler.mapper.TravelUserModelMapper;
import com.fantatravel.travel.model.Travel;
import com.fantatravel.travel.model.TravelUserRole;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class TotalPointsModelAssembler {

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
                .filter(tu -> tu.getRole().equals(TravelUserRole.TRAVELER))
                .map(user -> {
                    int totalPoints = user.getPoints().stream()
                            .mapToInt(p -> p.getTravelRule().getValue())
                            .sum();
                    return PointsUserModel.builder()
                            .user(TravelUserModelMapper.INSTANCE.toModel(user, SecurityUtils.getCurrentUser()))
                            .points(totalPoints)
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
