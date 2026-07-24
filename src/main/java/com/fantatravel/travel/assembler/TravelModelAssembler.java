package com.fantatravel.travel.assembler;

import com.fantatravel.rule.assembler.RuleModelAssembler;
import com.fantatravel.rule.representation.RuleModel;
import com.fantatravel.security.SecurityUtils;
import com.fantatravel.security.model.CustomUserDetails;
import com.fantatravel.team.assembler.TeamModelAssembler;
import com.fantatravel.travel.assembler.mapper.TravelModelMapper;
import com.fantatravel.travel.assembler.mapper.TravelRuleModelMapper;
import com.fantatravel.travel.assembler.mapper.TravelSpecialCategoryModelMapper;
import com.fantatravel.travel.assembler.mapper.TravelUserModelMapper;
import com.fantatravel.travel.model.*;
import com.fantatravel.travel.representation.TravelModel;
import com.fantatravel.travel.representation.TravelUserModel;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor
public class TravelModelAssembler {

    private final RuleModelAssembler ruleModelAssembler;
    private final TeamModelAssembler teamModelAssembler;
    private final TravelSpecialCategoryModelAssembler travelSpecialCategoryModelAssembler;

    public TravelModel toModel(Travel travel) {
        CustomUserDetails userDetails = SecurityUtils.getCurrentUser();
        TravelModel model = TravelModelMapper.INSTANCE.toModel(travel, userDetails);
        enrichWithTravelers(model, travel.getTravelUsers().stream().filter(tu -> tu.getRole().equals(TravelUserRole.TRAVELER)).toList(), userDetails);
        enrichWithPlayers(model, travel.getTravelUsers().stream().filter(tu -> tu.getRole().equals(TravelUserRole.PLAYER)).toList(), userDetails);
        enrichWithRules(model, travel.getTravelRules());
        enrichWithSpecialCategories(model, travel.getTravelSpecialCategories());
        return model;
    }

    public List<TravelModel> toModelList(List<Travel> travels) {
        return travels.stream()
                .map(this::toModel)
                .collect(Collectors.toList());
    }

    private void enrichWithSpecialCategories(TravelModel travelModel, List<TravelSpecialCategory> travelSpecialCategories) {
        travelModel.setSpecialCategories(travelSpecialCategoryModelAssembler.toModelList(travelSpecialCategories));
    }

    private void enrichWithTravelers(TravelModel travelModel, List<TravelUser> travelUsers, CustomUserDetails userDetails) {
        travelModel.setTravelers(travelUsers.stream()
                .map(tu -> TravelUserModelMapper.INSTANCE.toModel(tu, userDetails))
                .collect(Collectors.toList()));
    }

    private void enrichWithPlayers(TravelModel travelModel, List<TravelUser> travelUsers, CustomUserDetails userDetails) {
        travelModel.setPlayers(travelUsers.stream()
                .map(tu -> {
                    TravelUserModel tu1 = TravelUserModelMapper.INSTANCE.toModel(tu, userDetails);
                    tu1.setTeam(teamModelAssembler.toModel(tu.getTeam(), userDetails));
                    return tu1;
                })
                .collect(Collectors.toList()));
    }

    private void enrichWithRules(TravelModel travelModel, List<TravelRule> travelRules) {
        if (travelRules != null && !travelRules.isEmpty()) {
            travelModel.setRules(travelRules.stream()
                    .map(tr -> {
                        RuleModel ruleModel = TravelRuleModelMapper.INSTANCE.toModel(tr);
                        ruleModelAssembler.enrichWithDestinations(ruleModel, tr.getRule().getDestinations());
                        ruleModelAssembler.enrichWithCategory(ruleModel, tr.getRule().getCategory());
                        return ruleModel;
                    })
                    .collect(Collectors.toList()));
        }
    }
}
