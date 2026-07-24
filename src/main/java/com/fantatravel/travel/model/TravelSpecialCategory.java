package com.fantatravel.travel.model;

import com.fantatravel.point.model.Point;
import com.fantatravel.specialcategory.model.SpecialCategory;
import com.fantatravel.team.model.Team;
import com.fantatravel.user.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "specialcategories_travels", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"travel_id", "special_category_id"})
})
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TravelSpecialCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "travel_id", nullable = false)
    private Travel travel;

    @ManyToOne(optional = false)
    @JoinColumn(name = "special_category_id", nullable = false)
    private SpecialCategory specialCategory;

    @ManyToOne(optional = false)
    @JoinColumn(name = "travel_user_id", nullable = false)
    private TravelUser user;

}
