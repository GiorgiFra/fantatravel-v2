package com.fantatravel.team.representation;

import com.fantatravel.specialcategory.representation.SpecialCategoryModel;
import com.fantatravel.travel.model.TravelUser;
import com.fantatravel.travel.representation.TravelUserModel;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeamSpecialCategoryModel {
    private Long id;
    private SpecialCategoryModel specialCategory;
    private TravelUserModel travelUser;
}
