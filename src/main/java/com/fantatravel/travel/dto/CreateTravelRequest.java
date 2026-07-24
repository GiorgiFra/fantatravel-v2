package com.fantatravel.travel.dto;

import com.fantatravel.destination.representation.DestinationModel;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateTravelRequest {
    @NotNull
    private String name;
    @NotNull
    private DestinationModel destination;
    @NotNull
    private LocalDate startDate;
    @NotNull
    private LocalDate endDate;
}
