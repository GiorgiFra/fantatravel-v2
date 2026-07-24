package com.fantatravel.specialcategory.model;

import com.fantatravel.common.model.BaseAuditingEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "special_category")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SpecialCategory extends BaseAuditingEntity {

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", nullable = false, length = 255)
    private String description;

}
