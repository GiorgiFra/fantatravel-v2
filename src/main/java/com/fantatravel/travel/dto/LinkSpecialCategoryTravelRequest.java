package com.fantatravel.travel.dto;

import com.fantatravel.rule.representation.RuleModel;
import com.fantatravel.specialcategory.representation.SpecialCategoryModel;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class LinkSpecialCategoryTravelRequest {
    private List<SpecialCategoryModel> specialCategories;
}
