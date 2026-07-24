package com.fantatravel.category.assembler.mapper;

import com.fantatravel.category.model.Category;
import com.fantatravel.category.representation.CategoryModel;
import com.fantatravel.security.model.CustomUserDetails;
import com.fantatravel.travel.model.Travel;
import com.fantatravel.travel.representation.TravelModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CategoryModelMapper {

    CategoryModelMapper INSTANCE = Mappers.getMapper(CategoryModelMapper.class);
    
    CategoryModel toModel(Category category);
}
