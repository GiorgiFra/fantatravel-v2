package com.fantatravel.destination.representation;

import com.fantatravel.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DestinationModel {
    private Long id;
    private String name;
    private String description;
}

