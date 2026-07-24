package com.fantatravel.team.model;


import com.fantatravel.common.model.BaseAuditingEntity;
import com.fantatravel.destination.model.Destination;
import com.fantatravel.travel.model.TravelUser;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "team")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Team extends BaseAuditingEntity {

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "travel_user_id", nullable = false)
    private TravelUser travelUser;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @ToString.Exclude
    private List<TeamUser> teamUsers;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @ToString.Exclude
    private List<TeamSpecialCategory> teamSpecialCategories;

}
