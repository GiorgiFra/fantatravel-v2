package com.fantatravel.point.representation;

import com.fantatravel.security.representation.UserInfoModel;
import com.fantatravel.travel.representation.TravelUserModel;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PointsUserModel {
    int position;
    TravelUserModel user;
    int points;
}
