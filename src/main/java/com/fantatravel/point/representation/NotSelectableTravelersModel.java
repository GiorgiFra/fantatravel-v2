package com.fantatravel.point.representation;

import com.fantatravel.rule.representation.RuleModel;
import com.fantatravel.travel.representation.TravelUserModel;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class NotSelectableTravelersModel {
    private RuleModel rule;
    private List<TravelUserModel> users;
}
