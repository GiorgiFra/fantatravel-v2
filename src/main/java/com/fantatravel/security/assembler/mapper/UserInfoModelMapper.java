package com.fantatravel.security.assembler.mapper;


import com.fantatravel.security.model.CustomUserDetails;
import com.fantatravel.security.representation.UserInfoModel;
import com.fantatravel.user.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserInfoModelMapper {
    public static final UserInfoModelMapper INSTANCE = Mappers.getMapper(UserInfoModelMapper.class);

    @Mapping(target = "email", source = "username")
    UserInfoModel toModel(CustomUserDetails entity);

    UserInfoModel toModel(User entity);
}
