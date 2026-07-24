package com.fantatravel.team.assembler;

import com.fantatravel.rule.assembler.RuleModelAssembler;
import com.fantatravel.security.SecurityUtils;
import com.fantatravel.security.model.CustomUserDetails;
import com.fantatravel.team.assembler.mapper.TeamModelMapper;
import com.fantatravel.team.model.Team;
import com.fantatravel.team.representation.TeamModel;
import com.fantatravel.travel.assembler.mapper.TravelModelMapper;
import com.fantatravel.travel.model.Travel;
import com.fantatravel.travel.model.TravelUserRole;
import com.fantatravel.travel.representation.TravelModel;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class TeamModelAssembler {
    public TeamModel toModel(Team team, CustomUserDetails userDetails) {
        return TeamModelMapper.INSTANCE.toModel(team, userDetails);
    }
}
