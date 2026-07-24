package com.fantatravel.version.representation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class BuildInfoModel {
    private String version;
}
