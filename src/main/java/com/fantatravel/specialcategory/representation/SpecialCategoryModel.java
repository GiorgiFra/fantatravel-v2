package com.fantatravel.specialcategory.representation;

import com.fantatravel.team.representation.TeamUserModel;
import com.fantatravel.travel.representation.TravelUserModel;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class SpecialCategoryModel {
    private Long id;
    private Long travelSpecialCategoryId;
    private String name;
    private String description;
    private boolean selected;
    private TravelUserModel traveler;
}
