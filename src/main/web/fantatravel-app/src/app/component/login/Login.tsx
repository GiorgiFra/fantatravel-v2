import {Box, Button, Link, Paper, TextField, Typography,} from '@mui/material';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {AuthenticationRequest} from '../../models/models';
import {loginSchema} from './validation/login-schema';
import {useLogin} from "../../api/authentication/useAuthentication";
import {useTranslation} from "react-i18next";
import {useEffect} from "react";
import {Link as RouterLink, useLocation} from 'react-router-dom';

const Login = () => {
    const location = useLocation();
    console.log('Login location state:', location.state);
    const from = location.state?.from?.pathname || "/home";
    const {t: errorT} = useTranslation('translation', {keyPrefix: 'errors'});
    const {t: loginT} = useTranslation('translation', {keyPrefix: 'login'});
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AuthenticationRequest>({
        resolver: zodResolver(loginSchema),
    });
    const {mutate: login, isError, error} = useLogin(from);
    const onSubmit = async (data: AuthenticationRequest) => {
        login(data)
    };
    useEffect(() => {
        console.log((error?.response?.data as any)?.error);
    }, [error]);

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
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        {...register('password')}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    {isError && (
                        <Typography color="error" align="center" sx={{ mt: 1 }}>
                            {errorT((error?.response?.data as any)?.error)}
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
                        {loginT('login')}
                    </Button>
                </form>

                <Box mt={2} textAlign="center">
                    <Link to="/user-registration"   component={RouterLink}
                          state={{ from: {pathname: from} }}
                          underline="hover" color="primary">
                        {loginT('register')}
                    </Link>
                </Box>

                <Box mt={2} textAlign="center">
                    <Link to="/reset-password-request"   component={RouterLink}
                          underline="hover" color="primary">
                        {loginT('forgot_password')}
                    </Link>
                </Box>

                <Box mt={2} textAlign="center">
                    <Link to="/already-have-code-confirmation"   component={RouterLink}
                          underline="hover" color="primary">
                        {loginT('have_you_already_received_the_code')}
                    </Link>
                </Box>
            </Paper>
        </Box>
    );
};

export default Login;
