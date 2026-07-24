package com.fantatravel.point.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class AddPointRequest {

    private Long travelId;
    private LocalDate day;
    private List<AddPointRuleUsersRequest> rules;

}
