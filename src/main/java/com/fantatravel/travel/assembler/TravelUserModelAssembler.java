package com.fantatravel.travel.assembler;

import com.fantatravel.rule.assembler.RuleModelAssembler;
import com.fantatravel.rule.representation.RuleModel;
import com.fantatravel.security.SecurityUtils;
import com.fantatravel.team.assembler.TeamModelAssembler;
import com.fantatravel.team.model.Team;
import com.fantatravel.travel.assembler.mapper.TravelRuleModelMapper;
import com.fantatravel.travel.assembler.mapper.TravelUserModelMapper;
import com.fantatravel.travel.model.TravelRule;
import com.fantatravel.travel.model.TravelUser;
import com.fantatravel.travel.representation.TravelModel;
import com.fantatravel.travel.representation.TravelUserModel;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class TravelUserModelAssembler {

    private final TeamModelAssembler teamModelAssembler;

    public TravelUserModel toModel(TravelUser travelUser) {
        TravelUserModel model = TravelUserModelMapper.INSTANCE.toModel(travelUser, SecurityUtils.getCurrentUser());
        enrichWithTeam(model, travelUser.getTeam());
        return model;
    }

    public List<TravelUserModel> toModelList(List<TravelUser> travelUsers) {
        return travelUsers.stream()
                .map(this::toModel).toList();
    }

    private void enrichWithTeam(TravelUserModel model, Team team) {
        if(team != null) {
            model.setTeam(teamModelAssembler.toModel(team, SecurityUtils.getCurrentUser()));
        }
    }
}
