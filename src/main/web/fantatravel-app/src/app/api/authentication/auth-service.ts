import axiosInstance from '../axios-client';
import {AuthenticationRequest, AuthenticationResponse, UserInfoModel} from "../../models/models";

interface AuthMethods {
    /** calls POST /auth/login */
    login: (params: AuthenticationRequest) => Promise<AuthenticationResponse>;
    /** calls POST /auth/logout */
    logout: () => Promise<void>;
    /** calls GET /auth/refresh */
    refreshToken: (
        refreshtoken: string
    ) => Promise<AuthenticationResponse>;
    getUserInfo: () => Promise<UserInfoModel>;
}

export const AuthService = (): AuthMethods => {
    const login = async (params: AuthenticationRequest): Promise<AuthenticationResponse> => {
        const response = await axiosInstance.post<AuthenticationResponse>('/auth/login', params);
        return response.data;
    };

    const refreshToken = async (refreshToken: string): Promise<AuthenticationResponse> => {
        const response = await axiosInstance.post<AuthenticationResponse>(`/auth/refresh`, {
            token: refreshToken
        });
        return response.data;
    };

    const getUserInfo = async (): Promise<UserInfoModel> => {
        const response = await axiosInstance.get<UserInfoModel>('/auth/userInfo');
        return response.data;
    };

    const logout = async (): Promise<void> => {
        const response = await axiosInstance.delete<void>('/auth/logout');
        return response.data;
    };

    return {
        login,
        refreshToken,
        getUserInfo,
        logout
    };
};

