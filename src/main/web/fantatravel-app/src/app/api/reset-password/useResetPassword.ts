import {useMutation} from '@tanstack/react-query';
import {AxiosError} from "axios";
import {ResetPasswordService} from "./reset-password-service";
import {ResetPasswordRequest} from "../../models/models";
import {useNavigate} from "react-router-dom";

const {resetPasswordRequest, resetPassword} = ResetPasswordService();
export const useResetPasswordRequest = () => {
    return useMutation<void, AxiosError, string>({
        mutationKey: ["confirm"],
        mutationFn: (email: string) => resetPasswordRequest(email),
    });
};

export const useResetPassword = () => {
    const navigate = useNavigate();
    return useMutation<void, AxiosError, ResetPasswordRequest>({
        mutationKey: ["confirm"],
        mutationFn: (request: ResetPasswordRequest) => resetPassword(request),
        onSuccess: () => {
            navigate("/login");
        }
    });
};
