package com.fantatravel.travel.model;

import com.fantatravel.point.model.Point;
import com.fantatravel.rule.model.Rule;
import com.fantatravel.user.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "travels_rules")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TravelRule {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "travel_rule_seq")
    @SequenceGenerator(name = "travel_rule_seq", sequenceName = "travels_rules_id_seq", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "travel_id")
    private Travel travel;

    @ManyToOne
    @JoinColumn(name = "rule_id")
    private Rule rule;

    @Column(name = "repeatable", nullable = false)
    private boolean repeatable;

    @Column(name = "value", nullable = false)
    private int value;

    @OneToMany(mappedBy = "travelRule", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Point> points = new ArrayList<>();

}
