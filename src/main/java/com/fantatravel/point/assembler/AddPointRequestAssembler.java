package com.fantatravel.point.assembler;

import com.fantatravel.point.dto.AddPointRequest;
import com.fantatravel.point.dto.AddPointRuleUsersRequest;
import com.fantatravel.rule.assembler.RuleModelAssembler;
import com.fantatravel.travel.assembler.TravelRuleModelAssembler;
import com.fantatravel.travel.assembler.TravelUserModelAssembler;
import com.fantatravel.travel.model.Travel;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;

@Component
@AllArgsConstructor
public class AddPointRequestAssembler {

    private final TravelRuleModelAssembler travelRuleModelAssembler;
    private final TravelUserModelAssembler travelUserModelAssembler;

    public AddPointRequest toModel(Travel travel, LocalDate day) {
        AddPointRequest request = AddPointRequest.builder()
                .travelId(travel.getId())
                .day(day).rules(new ArrayList<>())
                .build();
        travel.getTravelRules().forEach(travelRule -> {
            request.getRules().add(
                    AddPointRuleUsersRequest.builder()
                            .rule(travelRuleModelAssembler.toModel(travelRule))
                            .users(travelRule.getPoints().stream()
                                    .filter(point -> point.getDay().equals(day))
                                    .map(point -> travelUserModelAssembler.toModel(point.getTravelUser())
                                    ).toList())
                            .build()
            );
        });
        return request;
    }
}
