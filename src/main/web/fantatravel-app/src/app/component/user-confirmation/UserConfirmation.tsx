import {Button, Container, Paper, TextField, Typography,} from '@mui/material';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useConfirmation} from '../../api/user/useUserService';
import {useLocation, useParams} from 'react-router-dom';

type ConfirmationForm = {
    code: string;
};

const UserConfirmation = () => {
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home";
    const { t: errorT } = useTranslation('translation', { keyPrefix: 'errors' });
    const { t: confirmT } = useTranslation('translation', { keyPrefix: 'confirm' });

    const { id } = useParams<{ id: string }>();
    const userId = Number(id);

    const { mutate: confirmUser, isError, error } = useConfirmation(userId, from);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ConfirmationForm>();

    const onSubmit = (data: ConfirmationForm) => {
        confirmUser(data.code);
    };

    return (
        <Container maxWidth={'md'}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2, mt: 18, mb: 1
            }}
        >
            <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h5" align="center" gutterBottom color="primary">
                    {confirmT('confirm')}
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <TextField
                        label={confirmT('code')}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        {...register('code', {
                            required: errorT('codeRequired') || 'Code is required',
                            pattern: {
                                value: /^\d{6}$/,
                                message: errorT('codeInvalid') || 'Code must be 6 digits',
                            },
                        })}
                        error={!!errors.code}
                        helperText={errors.code?.message}
                        inputProps={{ maxLength: 6 }}
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
                        {confirmT('confirm')}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default UserConfirmation;
