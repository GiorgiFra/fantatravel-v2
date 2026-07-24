package com.fantatravel.point.assembler;

import com.fantatravel.point.representation.PointsDayModel;
import com.fantatravel.point.representation.PointsUserModel;
import com.fantatravel.rule.assembler.mapper.RuleModelMapper;
import com.fantatravel.rule.model.Rule;
import com.fantatravel.rule.representation.RuleModel;
import com.fantatravel.security.SecurityUtils;
import com.fantatravel.travel.assembler.mapper.TravelUserModelMapper;
import com.fantatravel.travel.model.Travel;
import com.fantatravel.travel.model.TravelUserRole;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class PointsDayModelAssembler {

    public PointsDayModel toModel(Travel travel, LocalDate day) {
        PointsDayModel model = PointsDayModel.builder().day(day).build();

        // Costruisci lista utenti con punti
        List<PointsUserModel> usersWithPoints = travel.getTravelUsers().stream().filter(tu -> tu.getRole().equals(TravelUserRole.TRAVELER))
                .map(user -> {
                    int totalPoints = user.getPoints().stream()
                            .filter(p -> p.getDay().equals(day))
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

        model.setUsers(usersWithPoints);
        return model;
    }


    public List<PointsDayModel> toModelList(Travel travel) {
        return travel.getStartDate()
                .datesUntil(travel.getEndDate().plusDays(1))
                .map(day -> toModel(travel, day))
                .toList();
    }


}
