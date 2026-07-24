package com.fantatravel.category.assembler;

import com.fantatravel.category.assembler.mapper.CategoryModelMapper;
import com.fantatravel.category.model.Category;
import com.fantatravel.category.representation.CategoryModel;
import com.fantatravel.security.SecurityUtils;
import com.fantatravel.travel.model.Travel;
import com.fantatravel.travel.model.TravelUser;
import com.fantatravel.travel.model.TravelUserRole;
import com.fantatravel.travel.representation.TravelModel;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CategoryModelAssembler {

    public CategoryModel toModel(Category category) {
        return CategoryModelMapper.INSTANCE.toModel(category);
    }

    public List<CategoryModel> toModelList(List<Category> categories) {
        return categories.stream()
                .map(this::toModel)
                .collect(Collectors.toList());
    }

}
