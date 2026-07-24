package com.fantatravel.travel.representation;

import com.fantatravel.destination.representation.DestinationModel;
import com.fantatravel.rule.representation.RuleModel;
import com.fantatravel.specialcategory.representation.SpecialCategoryModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TravelModel {
    private Long id;
    private String name;
    private DestinationModel destination;
    private String startDate;
    private String endDate;
    private boolean admin;
    private List<TravelUserModel> travelers;
    private List<TravelUserModel> players;
    private List<RuleModel> rules;
    private List<SpecialCategoryModel> specialCategories;
    private boolean editable;
    private boolean reviewed;
    private String reviewedComment;
}

