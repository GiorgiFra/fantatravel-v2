package com.fantatravel.point.model;


import com.fantatravel.common.model.BaseAuditingEntity;
import com.fantatravel.team.model.TeamUser;
import com.fantatravel.travel.model.TravelRule;
import com.fantatravel.travel.model.TravelUser;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "point")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Point extends BaseAuditingEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "travels_users_id", nullable = false)
    private TravelUser travelUser;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "travels_rules_id", nullable = false)
    private TravelRule travelRule;

    @Column(name = "day", nullable = false, length = 255)
    private LocalDate day;


}
