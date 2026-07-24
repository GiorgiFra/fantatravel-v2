package com.fantatravel.rule.assembler;

import com.fantatravel.category.assembler.mapper.CategoryModelMapper;
import com.fantatravel.category.model.Category;
import com.fantatravel.destination.assembler.DestinationModelAssembler;
import com.fantatravel.destination.model.Destination;
import com.fantatravel.rule.assembler.mapper.RuleModelMapper;
import com.fantatravel.rule.model.Rule;
import com.fantatravel.rule.representation.RuleModel;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor
public class RuleModelAssembler {

    private final DestinationModelAssembler destinationModelAssembler;

    public RuleModel toModel(Rule rule) {
        RuleModel model = RuleModelMapper.INSTANCE.toModel(rule);
        enrichWithCategory(model, rule.getCategory());
        enrichWithDestinations(model, rule.getDestinations());
        return model;
    }

    public List<RuleModel> toModelList(List<Rule> rules) {
        return rules.stream()
                .map(this::toModel)
                .collect(Collectors.toList());
    }

    public void enrichWithCategory(RuleModel ruleModel, Category category) {
        ruleModel.setCategory(CategoryModelMapper.INSTANCE.toModel(category));
    }

    public void enrichWithDestinations(RuleModel ruleModel, List<Destination> destinations) {
        ruleModel.setDestinations(destinationModelAssembler.toModelList(destinations));
    }
}
