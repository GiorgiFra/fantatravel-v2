import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import { AuthService } from './auth-service';
import axiosInstance from "../axios-client";
import {AuthenticationRequest, AuthenticationResponse} from "../../models/models";
import {useNavigate} from "react-router-dom";
import {AxiosError} from "axios";

const { login, refreshToken, getUserInfo, logout } = AuthService();

export const useLogin = (from: string) => {
    const navigate = useNavigate();
    return useMutation<AuthenticationResponse, AxiosError, AuthenticationRequest>({
        mutationKey: ["login"],
        mutationFn: (params: AuthenticationRequest) => login(params),
        onSuccess: async (data: AuthenticationResponse) => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            navigate(from, { replace: true });
        }
    });
};

export const useRefreshToken = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["refreshToken"],
        mutationFn: (params: any) => refreshToken(params),
        onSuccess: async (data: AuthenticationResponse) => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            queryClient.invalidateQueries();
            return data;
        }
    });
};

export const useGetUserInfo = () => {
    return useQuery({
        queryKey: ["userInfo"],
        queryFn: (params: any) => getUserInfo(),
    });
};

export const useLogout = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationKey: ["logout"],
        mutationFn: () => logout(),
        onSuccess: async () => {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            navigate('/login');
        }
    });
};
