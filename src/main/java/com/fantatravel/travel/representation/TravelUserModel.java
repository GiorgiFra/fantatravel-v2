package com.fantatravel.travel.representation;

import com.fantatravel.destination.representation.DestinationModel;
import com.fantatravel.team.representation.TeamModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TravelUserModel {
    private Long id;
    private String firstName;
    private String lastName;
    private TeamModel team;
    private boolean isMe;
}

