package com.fantatravel.team.representation;

import lombok.Data;

import java.util.List;

@Data
public class TeamModel {
    private Long id;
    private String name;
    private List<TeamUserModel> teamUsers;
    private List<TeamSpecialCategoryModel> teamSpecialCategories;
    private boolean admin;
}
