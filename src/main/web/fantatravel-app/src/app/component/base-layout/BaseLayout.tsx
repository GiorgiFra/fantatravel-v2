import React, {ReactNode, useEffect} from 'react';
import {
    AppBar,
    BottomNavigation,
    BottomNavigationAction,
    Box,
    IconButton,
    Paper,
    Toolbar,
    Typography
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import ArrowBackIcon from "@mui/icons-material/ArrowBackIosNew";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PersonIcon from '@mui/icons-material/Person';
import theme from "../../theme/theme";
import {useNavigate, useParams} from "react-router-dom";
import InstallPWAButton from "../android/installer/InstallPWAButton";
import ScrollToTopContainer from "../scroll-to-top/ScrollToTop";
import {useTranslation} from "react-i18next";
import {useLanguage} from "../../api/user/useUserService";

interface BaseLayoutProps {
    children: ReactNode;
    title?: string;
    back? : {
        path: string;
        label: string;
    }
    notLoggedPage?: boolean;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({children, title, back, notLoggedPage}) => {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();
    const params = useParams();
    const {t, i18n} = useTranslation("translation", {keyPrefix: "menu"});
    const {data: language} = useLanguage(notLoggedPage);
    const resolvedBackPath = back?.path.replace(
        /:([a-zA-Z]+)/g,
        (_, key) => params[key as keyof typeof params] || ""
    );

    useEffect(() => {
        i18n.changeLanguage(language || 'en');
    }, [language, i18n]);


    return (

        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: theme.palette.background.default,
            overflowY: 'hidden',
            paddingTop: 'env(safe-area-inset-top)',

        }}>
            {/* HEADER */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    backgroundColor: theme.palette.background.default,
                    boxShadow: "none",
                    color: theme.palette.primary.main,
                    paddingTop: "env(safe-area-inset-top)",
                }}
            >
                <Toolbar sx={{ position: "relative" }}>
                    {back && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => navigate(resolvedBackPath!)}
                            sx={{ position: "absolute", left: 10 }}
                        >
                            <ArrowBackIcon />
                            {back.label && (
                                <Typography variant="body2" sx={{ ml: 0 }}>
                                    {back.label}
                                </Typography>
                            )}
                        </IconButton>
                    )}

                    <Typography
                        onClick={() => navigate('/home')}
                        variant="h6"
                        component="div"
                        sx={{
                            position: "absolute",
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontFamily: theme.typography.fontFamily,
                            fontWeight: 700,
                            letterSpacing: 1,
                            whiteSpace: "nowrap",
                        }}
                    >
                        {title || 'FANTATRAVEL'}
                    </Typography>
                </Toolbar>
            </AppBar>


            {/* CONTENT */}
            <Box
                component="main"
                sx={{
                    p: 1,
                    mt: `calc(48px + env(safe-area-inset-top))`,
                    overflowY: 'auto',
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    height: '87vh'
                }}
            >
                <ScrollToTopContainer>
                    {children}
                </ScrollToTopContainer>
            </Box>
            <InstallPWAButton/>

            {/* FOOTER / BOTTOM NAVIGATION */}
            <Paper
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                }}
                elevation={3}
            >
                {!notLoggedPage && (<BottomNavigation
                    showLabels
                    value={value}
                    onChange={(_, newValue) => setValue(newValue)}
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        borderTopLeftRadius: 32,
                        borderTopRightRadius: 32,
                    }}
                >
                    <BottomNavigationAction
                        label={t('home')}
                        icon={<HomeIcon/>}
                        onClick={() => navigate('/home')}
                        sx={{
                            color: theme.palette.primary.contrastText,
                            '&.Mui-selected': {
                                color: theme.palette.secondary.main,
                            }
                        }}
                    />
                    <BottomNavigationAction
                        label={t('teams')}
                        icon={<GroupIcon/>}
                        onClick={() => navigate('/teams')}
                        sx={{
                            color: theme.palette.primary.contrastText,
                            '&.Mui-selected': {
                                color: theme.palette.secondary.main,
                            }
                        }}
                    />
                    <BottomNavigationAction
                        label={t('travels')}
                        icon={<RocketLaunchIcon/>}
                        onClick={() => navigate('/travels')}
                        sx={{
                            color: theme.palette.primary.contrastText,
                            '&.Mui-selected': {
                                color: theme.palette.secondary.main,
                            }
                        }}
                    />
                    <BottomNavigationAction
                        label={t('profile')}
                        icon={<PersonIcon/>}
                        onClick={() => navigate('/profile')}
                        sx={{
                            color: theme.palette.primary.contrastText,
                            '&.Mui-selected': {
                                color: theme.palette.secondary.main,
                            }
                        }}
                    />
                </BottomNavigation>)}
            </Paper>
        </Box>
    );
};

export default BaseLayout;