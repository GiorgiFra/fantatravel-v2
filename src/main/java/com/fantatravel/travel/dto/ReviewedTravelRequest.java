package com.fantatravel.travel.dto;

import com.fantatravel.team.dto.CreateTeamUserRequest;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ReviewedTravelRequest {

    @NotEmpty
    List<AssignSpecialCategoryRequest> assignSpecialCategories;

    private String comment;

}
