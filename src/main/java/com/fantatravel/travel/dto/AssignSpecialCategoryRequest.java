package com.fantatravel.travel.dto;

import com.fantatravel.security.representation.UserInfoModel;
import com.fantatravel.specialcategory.representation.SpecialCategoryModel;
import lombok.Data;

@Data
public class AssignSpecialCategoryRequest {

    private UserInfoModel user;
    private SpecialCategoryModel specialCategory;

}
