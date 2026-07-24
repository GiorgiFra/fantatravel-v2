import {Box, Paper, TextField, Button, Typography} from '@mui/material';
import {useTranslation} from "react-i18next";
import {useResetPasswordRequest} from "../../api/reset-password/useResetPassword";
import {useForm} from "react-hook-form";
import React, {useState} from "react";

type FormData = {
    email: string;
};

const ResetPasswordRequest = () => {
    const {t: errorT} = useTranslation('translation', {keyPrefix: 'errors'});
    const {t: loginT} = useTranslation('translation', {keyPrefix: 'reset_password'});
    const {mutate: resetPasswordRequest} = useResetPasswordRequest();

    const {register, handleSubmit, formState: {errors}} = useForm<FormData>();
    const [submitted, setSubmitted] = useState(false);

    const onSubmit = (data: FormData) => {
        resetPasswordRequest(data.email);
        setSubmitted(true);
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
                {!submitted ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Typography variant="h6" mb={2}>
                            {loginT('reset_password')}
                        </Typography>

                        <TextField
                            fullWidth
                            label={loginT('email')}
                            type="email"
                            margin="normal"
                            {...register('email', {required: errorT('required_email')})}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />

                        <Box mt={2} textAlign="center">
                            <Button variant="contained" color="primary" type="submit">
                                {loginT('send')}
                            </Button>
                        </Box>
                    </form>
                ) : (
                    <Typography textAlign="center" color="text.secondary">
                        {loginT('reset_password_instructions')}
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default ResetPasswordRequest;
