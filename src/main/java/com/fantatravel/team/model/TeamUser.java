package com.fantatravel.team.model;

import com.fantatravel.travel.model.TravelUser;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "teams_users")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeamUser {

    @EmbeddedId
    private TeamUserId id;

    @ManyToOne
    @MapsId("teamId")
    @JoinColumn(name = "team_id")
    private Team team;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "travel_user_id")
    private TravelUser travelUser;

    @Column(name = "captain", nullable = false)
    private boolean captain;

}
