package com.fantatravel.point.representation;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class PointsDayModel {

    LocalDate day;
    List<PointsUserModel> users;


}
