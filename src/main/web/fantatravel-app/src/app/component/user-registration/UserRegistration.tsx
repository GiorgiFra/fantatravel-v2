import {Button, Container, Paper, TextField, Typography,} from '@mui/material';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {UserRegistrationRequest} from '../../models/models';
import {useTranslation} from 'react-i18next';
import {useEffect} from 'react';
import {useRegistration} from '../../api/user/useUserService';
import {userRegistrationSchema} from './validation/user-registration-schema';
import {useLocation} from "react-router-dom";

const UserRegistration = () => {
    const location = useLocation();
    console.log('Login location state:', location.state);
    const from = location.state?.from?.pathname|| "/home";
    const { t: errorT } = useTranslation('translation', { keyPrefix: 'errors' });
    const { t: registerT } = useTranslation('translation', { keyPrefix: 'register' });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UserRegistrationRequest>({
        resolver: zodResolver(userRegistrationSchema),
    });

    const { mutate: registerUser, isError, error } = useRegistration(from);

    const onSubmit = async (data: UserRegistrationRequest) => {
        registerUser(data);
    };

    useEffect(() => {
        if (isError) {
            console.log((error?.response?.data as any)?.error);
        }
    }, [error, isError]);

    return (
        <Container maxWidth={"md"}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
                mt: 4, mb: 6
            }}
        >
            <Paper  sx={{ p: 4, maxWidth: 450, width: '100%' }}>
                <Typography variant="h4" align="center" gutterBottom color="primary">
                    {registerT('register')}
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <TextField
                        label={registerT('first_name')}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        {...register('firstName')}
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                    />

                    <TextField
                        label={registerT('last_name')}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        {...register('lastName')}
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                    />

                    <TextField
                        label={registerT('email')}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    <TextField
                        label={registerT('password')}
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        {...register('password')}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />

                    <TextField
                        label={registerT('password_confirm')}
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        {...register('passwordRepeat')}
                        error={!!errors.passwordRepeat}
                        helperText={errors.passwordRepeat?.message}
                    />

                    {isError && (
                        <Typography color="error" align="center" sx={{ mt: 1 }}>
                            {errorT((error?.response?.data as any)?.error || 'Registration failed')}
                        </Typography>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={isSubmitting}
                    >
                        {registerT('register')}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default UserRegistration;
