package com.fantatravel.specialcategory.assembler;

import com.fantatravel.security.model.CustomUserDetails;
import com.fantatravel.specialcategory.assembler.mapper.SpecialCategoryModelMapper;
import com.fantatravel.specialcategory.model.SpecialCategory;
import com.fantatravel.specialcategory.representation.SpecialCategoryModel;
import com.fantatravel.team.assembler.mapper.TeamModelMapper;
import com.fantatravel.team.model.Team;
import com.fantatravel.team.representation.TeamModel;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

@Component
public class SpecialCategoryModelAssembler {

    public SpecialCategoryModel toModel(SpecialCategory specialCategory) {
        return SpecialCategoryModelMapper.INSTANCE.toModel(specialCategory);
    }

    public List<SpecialCategoryModel> toModelList(List<SpecialCategory> specialCategories) {
        List<SpecialCategoryModel> modelList = SpecialCategoryModelMapper.INSTANCE.toModelList(specialCategories);
        modelList.sort(Comparator.comparing(SpecialCategoryModel::getName, String.CASE_INSENSITIVE_ORDER));
        return modelList;
    }
}
