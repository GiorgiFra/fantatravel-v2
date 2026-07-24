import {Box, Button, MenuItem, Paper, Select, Typography} from "@mui/material";
import {useGetUserInfo, useLogout} from "../../api/authentication/useAuthentication";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {useChangeLanguage} from "../../api/user/useUserService";

const Profile = () => {
    const { data: userInfo } = useGetUserInfo();
    const { t, i18n } = useTranslation('translation', { keyPrefix: 'profile' });
    const { mutate: logout } = useLogout();
    const { mutate: changeLanguage } = useChangeLanguage();

    const [language, setLanguage] = useState(i18n.language);

    useEffect(() => {
        i18n.changeLanguage(language);
        changeLanguage(language);
    }, [language, i18n, changeLanguage]);

    if (!userInfo) return null;

    return (
        <Box display="flex" flexDirection="column" gap={2} sx={{ padding: 2, maxWidth: 600, margin: 'auto' }}>
            <Paper elevation={2} sx={{ p: 1 }}>
                <Typography><strong>{t('first_name')}</strong> {userInfo.firstName}</Typography>
                <Typography><strong>{t('last_name')}</strong> {userInfo.lastName}</Typography>
                <Typography><strong>{t('email')}</strong> {userInfo.email}</Typography>
            </Paper>

            <Select
                fullWidth
                label={t('language')}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                size="small"
            >
                <MenuItem value="it">
                    <span style={{ marginRight: 8 }}>🇮🇹</span>
                     Italiano</MenuItem>
                <MenuItem value="en">
                    <span style={{ marginRight: 8 }}>🇬🇧</span>
                    English</MenuItem>
            </Select>

            <Button variant="outlined" color="error" onClick={() => logout()}>
                {t('logout')}
            </Button>
        </Box>
    );
};

export default Profile;
