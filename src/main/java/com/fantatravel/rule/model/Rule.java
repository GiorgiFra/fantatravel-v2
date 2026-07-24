package com.fantatravel.rule.model;

import com.fantatravel.category.model.Category;
import com.fantatravel.common.model.BaseAuditingEntity;
import com.fantatravel.destination.model.Destination;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.LastModifiedBy;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "rule")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Rule extends BaseAuditingEntity {

    @Column(name = "description", nullable = false, length = 255)
    private String description;

    @Column(name = "repeatable", nullable = false)
    private boolean repeatable;

    @Column(name = "value", nullable = false)
    private int value;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "destinations_rules",
            joinColumns = @JoinColumn(name = "rule_id"),
            inverseJoinColumns = @JoinColumn(name = "destination_id")
    )
    private List<Destination> destinations;



}

