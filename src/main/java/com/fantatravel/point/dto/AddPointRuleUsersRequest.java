package com.fantatravel.point.dto;

import com.fantatravel.rule.representation.RuleModel;
import com.fantatravel.security.representation.UserInfoModel;
import com.fantatravel.travel.representation.TravelUserModel;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AddPointRuleUsersRequest {
    private RuleModel rule;
    private List<TravelUserModel> users;
}
