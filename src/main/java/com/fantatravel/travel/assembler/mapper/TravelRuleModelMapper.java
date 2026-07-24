package com.fantatravel.travel.assembler.mapper;

import com.fantatravel.rule.representation.RuleModel;
import com.fantatravel.travel.model.TravelRule;
import com.fantatravel.travel.model.TravelUser;
import com.fantatravel.travel.representation.TravelUserModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface TravelRuleModelMapper {

    TravelRuleModelMapper INSTANCE = Mappers.getMapper(TravelRuleModelMapper.class);
    @Mapping(target = "id", source = "travelRule.rule.id")
    @Mapping(target = "travelRuleId", source = "travelRule.id")
    @Mapping(target = "description", source = "travelRule.rule.description")
    @Mapping(target = "selected", expression = "java(true)")
    RuleModel toModel(TravelRule travelRule);
}
