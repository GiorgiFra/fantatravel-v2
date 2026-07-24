package com.fantatravel.team.model;

import com.fantatravel.travel.model.TravelSpecialCategory;
import com.fantatravel.travel.model.TravelUser;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "specialcategories_teams", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"team_id", "special_category_id", "travel_user_id"})
})
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeamSpecialCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(optional = false)
    @JoinColumn(name = "special_category_id", nullable = false)
    private TravelSpecialCategory travelSpecialCategory;

    @ManyToOne(optional = false)
    @JoinColumn(name = "travel_user_id", nullable = false)
    private TravelUser travelUser;

}
