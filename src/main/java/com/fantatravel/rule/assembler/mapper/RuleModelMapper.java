package com.fantatravel.rule.assembler.mapper;

import com.fantatravel.rule.model.Rule;
import com.fantatravel.rule.representation.RuleModel;
import com.fantatravel.security.model.CustomUserDetails;
import com.fantatravel.travel.model.Travel;
import com.fantatravel.travel.representation.TravelModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface RuleModelMapper {

    RuleModelMapper INSTANCE = Mappers.getMapper(RuleModelMapper.class);

    RuleModel toModel(Rule rule);
}
