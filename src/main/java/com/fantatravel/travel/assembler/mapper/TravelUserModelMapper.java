package com.fantatravel.travel.assembler.mapper;

import com.fantatravel.security.model.CustomUserDetails;
import com.fantatravel.travel.model.TravelUser;
import com.fantatravel.travel.representation.TravelUserModel;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface TravelUserModelMapper {

    TravelUserModelMapper INSTANCE = Mappers.getMapper(TravelUserModelMapper.class);
    @Mapping(target = "id", source = "travelUser.id")
    @Mapping(target = "firstName", source = "travelUser.user.firstName")
    @Mapping(target = "lastName", source = "travelUser.user.lastName")
    @Mapping(ignore = true, target = "team")
    @Mapping(target = "me", expression = "java(userDetails.getId().equals(travelUser.getUser().getId()))")
    TravelUserModel toModel(TravelUser travelUser,  @Context CustomUserDetails userDetails);
}
