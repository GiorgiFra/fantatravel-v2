package com.fantatravel.travel.dto;

import com.fantatravel.destination.representation.DestinationModel;
import com.fantatravel.rule.representation.RuleModel;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class LinkRuleTravelRequest {
    @NotEmpty
    private List<RuleModel> rules;
}
