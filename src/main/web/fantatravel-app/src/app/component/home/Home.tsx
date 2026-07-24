import { useGetUserInfo } from "../../api/authentication/useAuthentication";
import { useGetTravels } from "../../api/travel/useTravels";
import { useGetTeams } from "../../api/travel/useTravels";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Chip,
    LinearProgress,
    Stack,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    alpha
} from "@mui/material";
import {
    FlightTakeoff,
    EmojiEvents,
    Group,
    Star,
    ExpandMore,
    TrendingUp,
    Public
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/date-formatter";

const Home = () => {
    const { data: userInfo } = useGetUserInfo();
    const { data: travels } = useGetTravels();
    const { data: teams } = useGetTeams();
    const { t } = useTranslation("translation", { keyPrefix: "home" });
    const { t: regulationT } = useTranslation("translation", { keyPrefix: "regulation" });
    const { t: travelT, i18n } = useTranslation("translation", { keyPrefix: "travels" });
    const { t: destinationT } = useTranslation("translation", { keyPrefix: "destinations" });
    const navigate = useNavigate();

    // Stats calculation
    const activeTravels = travels?.filter(t => new Date(t.endDate) >= new Date()) || [];
    const myTeams = teams?.filter(t => t.players.find(p => p.me)?.team) || [];
    const totalPoints = myTeams.reduce((sum, team) => {
        const myPlayer = team.players.find(p => p.me);
        return sum + (myPlayer?.team?.totalPoints || 0);
    }, 0);

    return (
        <Box sx={{ p: 2, pb: 10 }}>
            {/* Welcome Header */}
            <Box sx={{
                mb: 3,
                p: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.15) 0%, rgba(0, 168, 232, 0.15) 100%)',
                border: '1px solid',
                borderColor: 'divider'
            }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: 'primary.main',
                            fontSize: '1.5rem',
                            fontWeight: 700
                        }}
                    >
                        {userInfo?.firstName?.charAt(0)}{userInfo?.lastName?.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>
                            {t("welcome", { name: `${userInfo?.firstName} ${userInfo?.lastName}` })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            🌍 Benvenuto nel tuo hub Fantatravel
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            {/* Quick Stats */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                    <Card sx={{
                        background: alpha('#FF6B35', 0.1),
                        border: '1px solid',
                        borderColor: alpha('#FF6B35', 0.3),
                        height: '100%'
                    }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <FlightTakeoff sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h4" fontWeight={700} color="primary.main">
                                {activeTravels.length}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Viaggi Attivi
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card sx={{
                        background: alpha('#00A8E8', 0.1),
                        border: '1px solid',
                        borderColor: alpha('#00A8E8', 0.3),
                        height: '100%'
                    }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Group sx={{ fontSize: 32, color: 'secondary.main', mb: 1 }} />
                            <Typography variant="h4" fontWeight={700} color="secondary.main">
                                {myTeams.length}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Squadre
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card sx={{
                        background: alpha('#FFC107', 0.1),
                        border: '1px solid',
                        borderColor: alpha('#FFC107', 0.3),
                        height: '100%'
                    }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <EmojiEvents sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
                            <Typography variant="h4" fontWeight={700} color="warning.main">
                                {totalPoints}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Punti Totali
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Active Travels */}
            {activeTravels.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <TrendingUp color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                            🔥 Viaggi in Corso
                        </Typography>
                    </Stack>
                    <Grid container spacing={2}>
                        {activeTravels.slice(0, 3).map((travel) => (
                            <Grid item xs={12} key={travel.id}>
                                <Card
                                    onClick={() => navigate(`/travels/${travel.id}`)}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            borderColor: 'primary.main'
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                                    <Typography variant="h6" fontWeight={600}>
                                                        {travel.name}
                                                    </Typography>
                                                    {travel.admin && (
                                                        <Chip
                                                            label="ADMIN"
                                                            size="small"
                                                            color="primary"
                                                            icon={<Star />}
                                                        />
                                                    )}
                                                </Stack>
                                                <Typography variant="body2" color="text.secondary">
                                                    <Public sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                                    {destinationT(travel.destination?.name)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDate(travel.startDate, i18n.language)} → {formatDate(travel.endDate, i18n.language)}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                        {/* Progress bar giorni rimanenti */}
                                        {(() => {
                                            const start = new Date(travel.startDate).getTime();
                                            const end = new Date(travel.endDate).getTime();
                                            const now = new Date().getTime();
                                            const progress = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
                                            return (
                                                <Box sx={{ mt: 2 }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={progress}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            backgroundColor: alpha('#00A8E8', 0.2),
                                                            '& .MuiLinearProgress-bar': {
                                                                background: 'linear-gradient(90deg, #FF6B35 0%, #FFC107 100%)'
                                                            }
                                                        }}
                                                    />
                                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                                        {Math.round(progress)}% completato
                                                    </Typography>
                                                </Box>
                                            );
                                        })()}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Regolamento Accordion */}
            <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <Star color="warning" />
                    <Typography variant="h6" fontWeight={600}>
                        📖 Regolamento Fantatravel
                    </Typography>
                </Stack>

                <Accordion defaultExpanded={false}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography fontWeight={600}>{regulationT("team_composition_title")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body2">{regulationT("team_composition_text")}</Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography fontWeight={600}>{regulationT("captain_title")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body2">{regulationT("captain_text")}</Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography fontWeight={600}>{regulationT("team_registration_title")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body2">{regulationT("team_registration_text")}</Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography fontWeight={600}>{regulationT("bonus_malus_title")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body2">{regulationT("bonus_malus_text")}</Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography fontWeight={600}>{regulationT("special_category_title")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body2">{regulationT("special_category_text")}</Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography fontWeight={600}>{regulationT("winner_title")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body2">{regulationT("winner_text")}</Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography fontWeight={600}>{regulationT("ethics_title")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body2">{regulationT("ethics_text")}</Typography>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
    );
};

export default Home;
