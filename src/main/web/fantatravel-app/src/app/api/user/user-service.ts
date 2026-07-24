import axiosInstance from '../axios-client';
import {UserInfoModel, UserRegistrationRequest} from "../../models/models";

interface AuthMethods {
    /** calls POST /user/register */
    register: (params: UserRegistrationRequest) => Promise<number>;
    /** calls POST /user/confirm/{id} */
    confirm: (
        id: number, code: string
    ) => Promise<string>;
    changeLanguage: (
        language: string
    ) => Promise<UserInfoModel>;
    getLanguage: (

    ) => Promise<string>;
    findByEmail: (email: string

    ) => Promise<UserInfoModel>;
}

export const UserService = (): AuthMethods => {
    const register = async (params: UserRegistrationRequest): Promise<number> => {
        const response = await axiosInstance.post<number>('/users/register', params);
        return response.data;
    };

    const confirm = async (id: number, code: string): Promise<string> => {
        const response = await axiosInstance.post<string>(`/users/confirm/${id}`, {
            confirmationCode: code
        });
        return response.data;
    };

    const changeLanguage = async (language: string): Promise<UserInfoModel> => {
        const response = await axiosInstance.patch<UserInfoModel>(`/users/language/${language}`);
        return response.data;
    };

    const getLanguage = async (): Promise<string> => {
        const response = await axiosInstance.get<string>(`/users/language`);
        return response.data;
    };

    const findUserConfirmation = async (email:string ): Promise<UserInfoModel> => {
        const response = await axiosInstance.get<UserInfoModel>(`/users/find-user-confirmation`, {
            params: {
                email
            }
        });
        return response.data;
    };

    return {
        register,
        confirm,
        changeLanguage,
        getLanguage,
        findByEmail: findUserConfirmation
    };
};

