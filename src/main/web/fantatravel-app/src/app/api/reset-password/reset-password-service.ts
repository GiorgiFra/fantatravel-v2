import axiosInstance from '../axios-client';
import {ResetPasswordRequest} from "../../models/models";

interface ResetPasswordMethods {
    /** calls POST /users/reset-password/request */
    resetPasswordRequest: (email: string) => Promise<void>;
    /** calls POST /users/reset-password/request */
    resetPassword: (request: ResetPasswordRequest) => Promise<void>;
}

export const ResetPasswordService = (): ResetPasswordMethods => {

    const resetPasswordRequest = async (email: string): Promise<void> => {
        const response = await axiosInstance.post<void>(`/users/reset-password/request`, null, {
            params: {email}
        });
        return response.data;
    };

    const resetPassword = async (request: ResetPasswordRequest): Promise<void> => {
        const response = await axiosInstance.post<void>(`/users/reset-password`, request);
        return response.data;
    };

    return {
        resetPasswordRequest,
        resetPassword
    };
};

