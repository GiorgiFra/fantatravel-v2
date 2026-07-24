import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Typography, IconButton, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const InstallPWAButton: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Se è già installata, nascondi il banner
        const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
        if (standalone) {
            setIsInstalled(true);
            return;
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowBanner(true);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowBanner(false);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('✅ PWA installed');
        } else {
            console.log('❌ PWA dismissed');
        }

        setDeferredPrompt(null);
        setShowBanner(false);
    };

    const handleCloseBanner = () => {
        setShowBanner(false);
    };

    if (!showBanner || isInstalled) return null;

    return (
        <Slide direction="up" in={showBanner} mountOnEnter unmountOnExit>
            <Paper
                elevation={3}
                sx={{
                    position: 'fixed',
                    bottom: 72,
                    left: 16,
                    right: 16,
                    margin: '0 auto',
                    maxWidth: 480,
                    p: 2,
                    zIndex: 1400,
                }}
            >

            <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                        <Typography variant="subtitle1">Installa l'app</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Aggiungi questa app alla schermata Home per un accesso più rapido.
                        </Typography>
                    </Box>
                    <IconButton onClick={handleCloseBanner}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="primary" onClick={handleInstallClick}>
                        Installa
                    </Button>
                </Box>
            </Paper>
        </Slide>
    );
};

export default InstallPWAButton;
