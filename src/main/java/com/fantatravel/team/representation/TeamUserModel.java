package com.fantatravel.team.representation;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeamUserModel {
    private Long id;
    private String firstName;
    private String lastName;
    private boolean captain;

}
