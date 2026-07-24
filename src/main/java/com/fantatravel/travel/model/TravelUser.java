package com.fantatravel.travel.model;

import com.fantatravel.point.model.Point;
import com.fantatravel.team.model.Team;
import com.fantatravel.user.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "travels_users", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"travel_id", "user_id"})
})
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TravelUser {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "travel_user_seq")
    @SequenceGenerator(name = "travel_user_seq", sequenceName = "travels_users_id_seq", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "travel_id", nullable = false)
    private Travel travel;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private TravelUserRole role;

    @OneToOne(mappedBy = "travelUser", fetch = FetchType.EAGER)
    @ToString.Exclude
    private Team team;

    @OneToMany(mappedBy = "travelUser", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Point> points = new ArrayList<>();

    /**
     * Validation: TRAVELER role in own travel cannot have a team
     * (Admin is TRAVELER, Players are PLAYER with team)
     */
    @PrePersist
    @PreUpdate
    private void validate() {
        if (role == TravelUserRole.TRAVELER && team != null) {
            throw new IllegalStateException("TRAVELER role cannot create a team in their own travel. Use PLAYER role to create teams.");
        }
    }


}
