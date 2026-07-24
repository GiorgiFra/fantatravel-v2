package com.fantatravel.point.assembler;

import com.fantatravel.point.representation.NotSelectableTravelersModel;
import com.fantatravel.travel.assembler.TravelRuleModelAssembler;
import com.fantatravel.travel.assembler.TravelUserModelAssembler;
import com.fantatravel.travel.model.TravelRule;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
public class NotSelectableTravelersModelAssembler {

    private final TravelRuleModelAssembler travelRuleModelAssembler;
    private final TravelUserModelAssembler travelUserModelAssembler;

    public NotSelectableTravelersModel toModel(TravelRule rule, LocalDate day) {
        NotSelectableTravelersModel model = NotSelectableTravelersModel.builder()
                .rule(travelRuleModelAssembler.toModel(rule))
                .users(new ArrayList<>())
                .build();
        if(!rule.isRepeatable()) {
            model.setUsers(rule.getPoints().stream()
                    .filter(point -> !point.getDay().equals(day))
                    .map(point -> travelUserModelAssembler.toModel(point.getTravelUser()))
                    .toList());
        }
        return model;
    }

    public List<NotSelectableTravelersModel> toModelList(List<TravelRule> rules, LocalDate day) {
        return rules.stream().map(rule -> toModel(rule, day))
                .filter(model -> !model.getUsers().isEmpty())
                .toList();
    }
}
