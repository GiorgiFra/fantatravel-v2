package com.fantatravel.security.assembler;

import com.fantatravel.security.assembler.mapper.UserInfoModelMapper;
import com.fantatravel.security.model.CustomUserDetails;
import com.fantatravel.security.representation.UserInfoModel;
import com.fantatravel.user.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserInfoModelAssembler {

    public UserInfoModel toUserInfo(CustomUserDetails customUserDetails) {
        return UserInfoModelMapper.INSTANCE.toModel(customUserDetails);
    }

    public UserInfoModel toUserInfo(User user) {
        return UserInfoModelMapper.INSTANCE.toModel(user);
    }
}
