package com.fantatravel.travel.model;

import com.fantatravel.common.model.BaseAuditingEntity;
import com.fantatravel.destination.model.Destination;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "travel")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Travel extends BaseAuditingEntity {

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "start_date", nullable = false, length = 255)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false, length = 255)
    private LocalDate endDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    @OneToMany(mappedBy = "travel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @ToString.Exclude
    private List<TravelRule> travelRules;

    @OneToMany(mappedBy = "travel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @ToString.Exclude
    private List<TravelUser> travelUsers;

    @OneToMany(mappedBy = "travel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @ToString.Exclude
    private List<TravelSpecialCategory> travelSpecialCategories;

    @Column(name = "reviewed")
    private boolean reviewed;

    @Column(name = "reviewed_comment", nullable = false, length = 255)
    private String reviewedComment;

    @Column(name = "invite_token", unique = true, length = 36)
    private String inviteToken;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private TravelStatus status = TravelStatus.DRAFT;


}

