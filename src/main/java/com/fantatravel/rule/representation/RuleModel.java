package com.fantatravel.rule.representation;

import com.fantatravel.category.representation.CategoryModel;
import com.fantatravel.destination.representation.DestinationModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RuleModel {
    private Long id;
    private Long travelRuleId;
    private String description;
    private boolean repeatable;
    private int value;
    private CategoryModel category;
    private List<DestinationModel > destinations;
    private boolean selected;
}
