package com.fantatravel.team.dto;

import com.fantatravel.travel.dto.AssignSpecialCategoryRequest;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateTeamRequest {

    @NotNull
    private Long travelId;

    @NotNull
    private String name;

    @NotNull
    @NotEmpty
    private List<CreateTeamUserRequest> users;

    List<AssignSpecialCategoryRequest> specialCategories;

}
