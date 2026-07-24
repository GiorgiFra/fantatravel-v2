package com.fantatravel.travel.assembler.mapper;

import com.fantatravel.security.SecurityUtils;
import com.fantatravel.specialcategory.model.SpecialCategory;
import com.fantatravel.specialcategory.representation.SpecialCategoryModel;
import com.fantatravel.travel.model.TravelSpecialCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;


import java.util.List;

@Mapper(componentModel = "spring", imports = { SecurityUtils.class })
public interface TravelSpecialCategoryModelMapper {
    TravelSpecialCategoryModelMapper INSTANCE = Mappers.getMapper(TravelSpecialCategoryModelMapper.class);

    @Mapping(target = "travelSpecialCategoryId", source = "travelSpecialCategory.id")
    @Mapping(target = "id", source = "specialCategory.id")
    @Mapping(target = "name", source = "travelSpecialCategory.specialCategory.name")
    @Mapping(target = "description", source = "travelSpecialCategory.specialCategory.description")
    @Mapping(target = "selected", expression = "java(true)")
    @Mapping(target = "traveler", expression = "java(TravelUserModelMapper.INSTANCE.toModel(travelSpecialCategory.getUser(), SecurityUtils.getCurrentUser()))")
    SpecialCategoryModel toModel(TravelSpecialCategory travelSpecialCategory);

    List<SpecialCategoryModel> toModelList(List<TravelSpecialCategory> specialCategories);
}
