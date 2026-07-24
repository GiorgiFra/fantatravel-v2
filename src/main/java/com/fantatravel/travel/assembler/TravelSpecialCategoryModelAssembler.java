package com.fantatravel.travel.assembler;

import com.fantatravel.rule.assembler.RuleModelAssembler;
import com.fantatravel.rule.representation.RuleModel;
import com.fantatravel.specialcategory.representation.SpecialCategoryModel;
import com.fantatravel.travel.assembler.mapper.TravelRuleModelMapper;
import com.fantatravel.travel.assembler.mapper.TravelSpecialCategoryModelMapper;
import com.fantatravel.travel.model.TravelRule;
import com.fantatravel.travel.model.TravelSpecialCategory;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

@Component
@AllArgsConstructor
public class TravelSpecialCategoryModelAssembler {

    public SpecialCategoryModel toModel(TravelSpecialCategory travelSpecialCategory) {
        return TravelSpecialCategoryModelMapper.INSTANCE.toModel(travelSpecialCategory);
    }

    public List<SpecialCategoryModel> toModelList(List<TravelSpecialCategory> travelSpecialCategories) {
        List<SpecialCategoryModel> modelList = TravelSpecialCategoryModelMapper.INSTANCE.toModelList(travelSpecialCategories);
        if(modelList != null) {
            modelList.sort(Comparator.comparing(SpecialCategoryModel::getName, String.CASE_INSENSITIVE_ORDER));
        }
        return modelList;
    }
}
