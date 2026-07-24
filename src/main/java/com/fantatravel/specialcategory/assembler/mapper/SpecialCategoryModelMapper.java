package com.fantatravel.specialcategory.assembler.mapper;

import com.fantatravel.security.model.CustomUserDetails;
import com.fantatravel.specialcategory.model.SpecialCategory;
import com.fantatravel.specialcategory.representation.SpecialCategoryModel;
import com.fantatravel.team.model.Team;
import com.fantatravel.team.model.TeamUser;
import com.fantatravel.team.representation.TeamModel;
import com.fantatravel.team.representation.TeamUserModel;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SpecialCategoryModelMapper {

    SpecialCategoryModelMapper INSTANCE = Mappers.getMapper(SpecialCategoryModelMapper.class);
    @Mapping(ignore = true, target = "travelSpecialCategoryId")
    SpecialCategoryModel toModel(SpecialCategory specialCategory);

    List<SpecialCategoryModel> toModelList(List<SpecialCategory> specialCategories);
}
