package com.fantatravel.team.dto;

import com.fantatravel.security.representation.UserInfoModel;
import lombok.Data;

@Data
public class CreateTeamUserRequest {

    private UserInfoModel user;
    private boolean captain;

}
