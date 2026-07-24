import {Box, Button, Paper, TextField, Typography} from '@mui/material';
import {useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";
import React from "react";
import {useFindUserConfirmation} from "../../api/user/useUserService";
import {UserInfoModel} from "../../models/models";
import {useNavigate} from "react-router-dom";

type FormData = {
    email: string;
};

const AlreadyHaveCodeConfirmation = () => {
    const {t: errorT} = useTranslation('translation', {keyPrefix: 'errors'});
    const {t: resetT} = useTranslation('translation', {keyPrefix: 'reset_password'});
    const {t: loginT} = useTranslation('translation', {keyPrefix: 'login'});

    const {register, handleSubmit, formState: {errors}} = useForm<FormData>();

    const {mutate: findByEmail, isError, error} = useFindUserConfirmation();
    const navigate = useNavigate();
    const onSubmit = (data: FormData) => {
        findByEmail(data.email, {
            onSuccess: (user : UserInfoModel) => navigate(`/user-confirmation/${user.id}`),
        });
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
                        <Typography variant="h6" mb={2}>
                            {loginT('have_you_already_received_the_code')}
                        </Typography>

                        <TextField
                            fullWidth
                            label={resetT('email')}
                            type="email"
                            margin="normal"
                            {...register('email', {required: errorT('required_email')})}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />

                        <Box mt={2} textAlign="center">
                            <Button variant="contained" color="primary" type="submit">
                                {resetT('send')}
                            </Button>
                        </Box>
                        {isError && (
                            <Typography color="error" align="center" sx={{ mt: 1 }}>
                                {errorT((error?.response?.data as any)?.error)}
                            </Typography>
                        )}
                    </form>
            </Paper>
        </Box>
    );
};

export default AlreadyHaveCodeConfirmation;
