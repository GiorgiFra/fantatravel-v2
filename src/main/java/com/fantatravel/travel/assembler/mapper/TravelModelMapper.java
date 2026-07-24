package com.fantatravel.travel.assembler.mapper;

import com.fantatravel.security.model.CustomUserDetails;
import com.fantatravel.travel.model.Travel;
import com.fantatravel.travel.representation.TravelModel;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface TravelModelMapper {

    TravelModelMapper INSTANCE = Mappers.getMapper(TravelModelMapper.class);
    @Mapping(target = "id", source = "travel.id")
    @Mapping(target = "admin", expression = "java(userDetails.getId().equals(travel.getCreatedBy().getId()))")
    @Mapping(
            target = "editable",
            expression = "java(java.time.LocalDate.now().isBefore(travel.getStartDate()))"
    )
    TravelModel toModel(Travel travel, CustomUserDetails userDetails);
}
