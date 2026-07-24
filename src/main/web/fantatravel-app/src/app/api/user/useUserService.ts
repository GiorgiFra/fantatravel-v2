import {useMutation, useQuery} from '@tanstack/react-query';
import {UserService} from './user-service';
import {UserRegistrationRequest} from "../../models/models";
import {useNavigate} from "react-router-dom";
import {AxiosError} from "axios";

const {register, confirm, changeLanguage, getLanguage, findByEmail} = UserService();

export const useRegistration = (from: string) => {
    const navigate = useNavigate();
    return useMutation<number, AxiosError, UserRegistrationRequest>({
        mutationKey: ["register"],
        mutationFn: (params: UserRegistrationRequest) => register(params),
        onSuccess: async (id: number) => {
            navigate(`/user-confirmation/${id}`, {state: {from: {pathname: from}}})
        }
    });
};

export const useConfirmation = (id: number, from: string) => {
    const navigate = useNavigate();
    return useMutation<string, AxiosError, string>({
        mutationKey: ["confirm"],
        mutationFn: (code: string) => confirm(id, code),
        onSuccess: async (response: string) => {
            navigate(`/login`, {state: {from: {pathname: from}}})
        }
    });
};
export const useChangeLanguage = () => {
    return useMutation({
        mutationKey: ["confirm"],
        mutationFn: (language: string) => changeLanguage(language),
    });
};

export const useLanguage = (notLoggedPage?: boolean) => {
    return useQuery({
        queryKey: ["language"],
        queryFn: () => getLanguage(),
        enabled: !notLoggedPage,
        throwOnError: false
    });
};

export const useFindUserConfirmation = () => {
    return useMutation<any, AxiosError, any>({
        mutationKey: ["find-by-email"],
        mutationFn: (email: string) => findByEmail(email),
    });
};
