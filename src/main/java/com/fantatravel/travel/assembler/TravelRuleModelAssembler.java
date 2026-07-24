package com.fantatravel.travel.assembler;

import com.fantatravel.rule.assembler.RuleModelAssembler;
import com.fantatravel.rule.representation.RuleModel;
import com.fantatravel.security.SecurityUtils;
import com.fantatravel.travel.assembler.mapper.TravelModelMapper;
import com.fantatravel.travel.assembler.mapper.TravelRuleModelMapper;
import com.fantatravel.travel.assembler.mapper.TravelUserModelMapper;
import com.fantatravel.travel.model.Travel;
import com.fantatravel.travel.model.TravelRule;
import com.fantatravel.travel.model.TravelUser;
import com.fantatravel.travel.model.TravelUserRole;
import com.fantatravel.travel.representation.TravelModel;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor
public class TravelRuleModelAssembler {

    private final RuleModelAssembler ruleModelAssembler;

    public RuleModel toModel(TravelRule travelRule) {
        RuleModel ruleModel = TravelRuleModelMapper.INSTANCE.toModel(travelRule);
        ruleModelAssembler.enrichWithDestinations(ruleModel, travelRule.getRule().getDestinations());
        ruleModelAssembler.enrichWithCategory(ruleModel, travelRule.getRule().getCategory());
        return ruleModel;
    }

    public List<RuleModel> toModelList(List<TravelRule> travelRules) {
        return travelRules.stream()
                .map(this::toModel).toList();
    }
}
