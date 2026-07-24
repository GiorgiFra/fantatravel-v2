package com.fantatravel.team.assembler.mapper;

import com.fantatravel.security.SecurityUtils;
import com.fantatravel.security.model.CustomUserDetails;
import com.fantatravel.team.model.Team;
import com.fantatravel.team.model.TeamSpecialCategory;
import com.fantatravel.team.model.TeamUser;
import com.fantatravel.team.representation.TeamModel;
import com.fantatravel.team.representation.TeamSpecialCategoryModel;
import com.fantatravel.team.representation.TeamUserModel;
import com.fantatravel.travel.assembler.mapper.TravelSpecialCategoryModelMapper;
import com.fantatravel.travel.assembler.mapper.TravelUserModelMapper;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.Comparator;
import java.util.List;

@Mapper(componentModel = "spring")
public interface TeamModelMapper {

    TeamModelMapper INSTANCE = Mappers.getMapper(TeamModelMapper.class);
    @Mapping(target = "teamUsers", source = "teamUsers", qualifiedByName = "teamUsers")
    @Mapping(target = "teamSpecialCategories", source = "teamSpecialCategories", qualifiedByName = "teamSpecialCategories")
    @Mapping(target = "admin", expression = "java(userDetails.getId().equals(team.getTravelUser().getUser().getId()))")
    TeamModel toModel(Team team, @Context CustomUserDetails userDetails);

    @Named("teamSpecialCategories")
    static List<TeamSpecialCategoryModel> getTeamSpecialCategories(List<TeamSpecialCategory> teamSpecialCategories) {
        return teamSpecialCategories.stream()
                .map(tu ->
                        TeamSpecialCategoryModel.builder()
                                .id(tu.getId())
                                .specialCategory(TravelSpecialCategoryModelMapper.INSTANCE.toModel(tu.getTravelSpecialCategory()))
                                .travelUser(TravelUserModelMapper.INSTANCE.toModel(tu.getTravelUser(), SecurityUtils.getCurrentUser()))
                                .build())
                .sorted(Comparator.comparing(
                        tsc -> tsc.getSpecialCategory().getName(),
                        String.CASE_INSENSITIVE_ORDER
                ))
                .toList();
    }


    @Named("teamUsers")
    static List<TeamUserModel> getTeamUsers(List<TeamUser> teamUsers) {
        return teamUsers.stream()
                .map(tu ->
                        TeamUserModel.builder()
                                .id(tu.getTravelUser().getId())
                                .firstName(tu.getTravelUser().getUser().getFirstName())
                                .lastName(tu.getTravelUser().getUser().getLastName())
                                .captain(tu.isCaptain())
                                .build()).toList();
    }
}
