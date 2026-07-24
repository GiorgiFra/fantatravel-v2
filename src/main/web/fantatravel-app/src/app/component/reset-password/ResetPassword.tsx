import {Box, Paper, TextField, Button, Typography} from '@mui/material';
import {useTranslation} from "react-i18next";
import {useParams} from 'react-router-dom';
import {useResetPassword} from "../../api/reset-password/useResetPassword";
import {ResetPasswordRequest} from "../../models/models";
import {useForm} from "react-hook-form";
import React from "react";

const ResetPassword = () => {
    const { token } = useParams<{ token: string }>();
    const { t: errorT } = useTranslation('translation', { keyPrefix: 'errors' });
    const { t: resetT } = useTranslation('translation', { keyPrefix: 'reset_password' });
    const { mutate: resetPassword, error, isError } = useResetPassword();

    const { register, handleSubmit,
        watch, formState: { errors } } = useForm<ResetPasswordRequest>({
        defaultValues: {
            token: token ?? '',
        }
    });

    const onSubmit = (data: ResetPasswordRequest) => {
        const payload: ResetPasswordRequest = {
            password: data.password,
            passwordRepeat: data.passwordRepeat,
            token: data.token ?? ''
        };
        resetPassword(payload);
    };

    return (
        <Box
            sx={{
                minHeight: '80vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
            }}
        >
            <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Typography variant="h6" mb={2} textAlign="center">
                        {resetT('title')}
                    </Typography>

                    <TextField
                        fullWidth
                        label={resetT('new_password')}
                        type="password"
                        margin="normal"
                        {...register('password', { required: errorT('required_password') })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />

                    <TextField
                        fullWidth
                        label={resetT('repeat_password')}
                        type="password"
                        margin="normal"
                        {...register('passwordRepeat', {
                            required: errorT('required_password_repeat'),
                            validate: (value) => value === watch('password') || errorT('passwords_not_match')
                        })}
                        error={!!errors.passwordRepeat}
                        helperText={errors.passwordRepeat?.message}
                    />

                    <Box mt={2} textAlign="center">
                        <Button variant="contained" color="primary" type="submit">
                            {resetT('confirm')}
                        </Button>
                    </Box>
                    {isError && (
                        <Typography variant="body2" color="error" textAlign="center" mt={2}>
                            {resetT((error.response?.data as any).error)}
                        </Typography>
                    )}
                </form>
            </Paper>
        </Box>
    );
};

export default ResetPassword;
