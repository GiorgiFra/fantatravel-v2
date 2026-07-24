import React, { useState } from "react";
import {
    Button,
    Card,
    CardContent,
    ClickAwayListener,
    Container,
    Fab,
    Grid,
    IconButton,
    Paper,
    Popper,
    Typography,
    Chip,
    Stack,
    Box,
    alpha,
    Badge,
    Avatar
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
    Star,
    Public,
    Group,
    EmojiEvents,
    FlightTakeoff,
    CalendarToday,
    TrendingUp
} from "@mui/icons-material";
import { useDeleteTravel, useGetTravels } from "../../api/travel/useTravels";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/date-formatter";

const Travels = () => {
    const { t: destinationT, i18n } = useTranslation("translation", { keyPrefix: "destinations" });
    const { t: travelT } = useTranslation("translation", { keyPrefix: "travels" });
    const { t: commonT } = useTranslation("translation", { keyPrefix: "commons" });
    const navigate = useNavigate();
    const { data: travels, refetch } = useGetTravels();
    const { mutateAsync: deleteTravel } = useDeleteTravel();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [confirmingId, setConfirmingId] = useState<number | null>(null);

    const handleDeleteClick = (event: React.MouseEvent<HTMLElement>, id: number) => {
        event.stopPropagation();
        setAnchorEl(anchorEl ? null : event.currentTarget);
        setConfirmingId(anchorEl ? null : id);
    };

    const handleConfirmDelete = async () => {
        if (confirmingId) {
            await deleteTravel(confirmingId);
            setAnchorEl(null);
            setConfirmingId(null);
            refetch();
        }
    };

    const handleCancel = () => {
        setAnchorEl(null);
        setConfirmingId(null);
    };

    const getTravelStatus = (startDate: string, endDate: string) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now < start) {
            return { label: "In arrivo", color: "info", icon: <CalendarToday sx={{ fontSize: 14 }} /> };
        } else if (now >= start && now <= end) {
            return { label: "In corso", color: "success", icon: <TrendingUp sx={{ fontSize: 14 }} /> };
        } else {
            return { label: "Completato", color: "default", icon: <EmojiEvents sx={{ fontSize: 14 }} /> };
        }
    };

    const open = Boolean(anchorEl);
    const id = open ? "delete-popper" : undefined;

    return (
        <Container maxWidth="xl" sx={{ pb: 10, pt: 1 }}>
            <Grid container spacing={2}>
                {travels?.map((travel) => {
                    const status = getTravelStatus(travel.startDate, travel.endDate);
                    const travelersCount = travel.travelers?.length || 0;
                    const playersCount = travel.players?.length || 0;

                    return (
                        <Grid item xs={12} sm={6} md={4} key={travel.id}>
                            <Card
                                onClick={() => navigate(`/travels/${travel.id}`)}
                                sx={{
                                    position: "relative",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {/* Header with badges */}
                                <Box
                                    sx={{
                                        position: "relative",
                                        p: 2,
                                        pb: 1,
                                        background: `linear-gradient(135deg, ${alpha('#FF6B35', 0.1)} 0%, ${alpha('#00A8E8', 0.1)} 100%)`,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    {/* Delete button */}
                                    {travel.admin && (
                                        <IconButton
                                            aria-describedby={id}
                                            onClick={(e) => handleDeleteClick(e, travel.id)}
                                            sx={{
                                                position: "absolute",
                                                top: 8,
                                                right: 8,
                                                zIndex: 10,
                                                bgcolor: alpha('#000', 0.4),
                                                color: "error.main",
                                                '&:hover': {
                                                    bgcolor: alpha('#F44336', 0.2),
                                                }
                                            }}
                                            size="small"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    )}

                                    {/* Role badges */}
                                    <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
                                        {travel.admin && (
                                            <Chip
                                                label="ADMIN"
                                                size="small"
                                                icon={<Star sx={{ fontSize: 14 }} />}
                                                sx={{
                                                    background: alpha('#FFC107', 0.2),
                                                    color: 'warning.main',
                                                    fontWeight: 700,
                                                    fontSize: '0.65rem',
                                                    height: 20,
                                                    borderColor: 'warning.main'
                                                }}
                                                variant="outlined"
                                            />
                                        )}
                                        <Chip
                                            label={status.label}
                                            size="small"
                                            icon={status.icon}
                                            color={status.color as any}
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: '0.65rem',
                                                height: 20
                                            }}
                                        />
                                    </Stack>

                                    {/* Title & Destination */}
                                    <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, pr: travel.admin ? 5 : 0 }}>
                                        {travel.name}
                                    </Typography>
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Public sx={{ fontSize: 16, color: 'secondary.main' }} />
                                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                            {destinationT(travel.destination?.name)}
                                        </Typography>
                                    </Stack>
                                </Box>

                                {/* Body */}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    {/* Date */}
                                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 2 }}>
                                        <FlightTakeoff sx={{ fontSize: 16, color: 'primary.main' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {formatDate(travel.startDate, i18n.language)} → {formatDate(travel.endDate, i18n.language)}
                                        </Typography>
                                    </Stack>

                                    {/* Stats */}
                                    <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                            <Paper
                                                sx={{
                                                    p: 1,
                                                    textAlign: 'center',
                                                    background: alpha('#00A8E8', 0.05),
                                                    border: '1px solid',
                                                    borderColor: alpha('#00A8E8', 0.2)
                                                }}
                                            >
                                                <Badge badgeContent={travelersCount} color="secondary" max={99}>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: alpha('#00A8E8', 0.2) }}>
                                                        <FlightTakeoff sx={{ fontSize: 18, color: 'secondary.main' }} />
                                                    </Avatar>
                                                </Badge>
                                                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                                    Viaggiatori
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Paper
                                                sx={{
                                                    p: 1,
                                                    textAlign: 'center',
                                                    background: alpha('#FF6B35', 0.05),
                                                    border: '1px solid',
                                                    borderColor: alpha('#FF6B35', 0.2)
                                                }}
                                            >
                                                <Badge badgeContent={playersCount} color="primary" max={99}>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: alpha('#FF6B35', 0.2) }}>
                                                        <Group sx={{ fontSize: 18, color: 'primary.main' }} />
                                                    </Avatar>
                                                </Badge>
                                                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                                    Giocatori
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </CardContent>

                                {/* Delete confirmation popper */}
                                <Popper
                                    id={id}
                                    open={open && confirmingId === travel.id}
                                    anchorEl={anchorEl}
                                    placement="top-start"
                                    disablePortal={false}
                                    modifiers={[
                                        {
                                            name: "offset",
                                            options: {
                                                offset: [0, 8],
                                            },
                                        },
                                    ]}
                                >
                                    <ClickAwayListener onClickAway={handleCancel}>
                                        <Paper
                                            sx={{
                                                p: 1.5,
                                                display: "flex",
                                                flexDirection: 'column',
                                                gap: 1,
                                                bgcolor: "background.paper",
                                                boxShadow: 6,
                                                borderRadius: 2,
                                                border: "2px solid",
                                                borderColor: "error.main"
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Typography variant="body2" fontWeight={600}>
                                                {commonT("confirm_delete")}
                                            </Typography>
                                            <Stack direction="row" spacing={1}>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="error"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleConfirmDelete();
                                                    }}
                                                >
                                                    {commonT("yes")}
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCancel();
                                                    }}
                                                >
                                                    {commonT("no")}
                                                </Button>
                                            </Stack>
                                        </Paper>
                                    </ClickAwayListener>
                                </Popper>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            <Fab
                color="primary"
                aria-label="add"
                sx={{
                    position: "fixed",
                    bottom: 80,
                    right: 16,
                    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)',
                }}
                onClick={() => {
                    navigate("/travels/create");
                }}
            >
                <AddIcon />
            </Fab>
        </Container>
    );
};

export default Travels;
