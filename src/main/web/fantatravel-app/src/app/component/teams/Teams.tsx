import {Card, CardContent, Container, Grid, IconButton, Stack, Typography} from "@mui/material";
import {Add, Edit, Visibility} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useGetTeams} from "../../api/travel/useTravels";
import React from "react";
import {formatDate} from "../../utils/date-formatter";

const Teams = () => {
    const {t: destinationT, i18n} = useTranslation("translation", {keyPrefix: "destinations"});
    const {t: teamT} = useTranslation("translation", {keyPrefix: "teams"});
    const navigate = useNavigate();
    const {data: travels} = useGetTeams();


    return (
        <Container maxWidth="xl" sx={{pb: 1, pt: 1}}>
            <Grid container spacing={2} >
                {travels?.map((travel) => (
                    <Card
                        variant="outlined"
                        key={travel.id}
                        onClick={() => {
                            navigate(`/teams/${travel.id}`);
                        }}
                        sx={{position: "relative"}}
                    >
                        <CardContent>
                            <Typography variant="h6">{travel.name}</Typography>
                            <Typography color="textSecondary">
                                {formatDate(travel.startDate, i18n.language)} → {formatDate(travel.endDate, i18n.language)}
                            </Typography>
                            <Typography color="textSecondary">
                                {`${teamT("destination")}: ${destinationT(travel.destination?.name)}`}
                            </Typography>
                            <Stack
                                direction="row"
                                onClick={(event) => event.stopPropagation()}
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{
                                    p: 1,
                                    borderRadius: 1,
                                    backgroundColor: "action.hover"
                                }}
                            >
                                {travel.players.find(p => p.me)?.team ? (
                                    <>
                                        <Typography fontWeight="bold">
                                            {`${teamT("team")}: ${travel.players.find(p => p.me)?.team.name}`}
                                        </Typography>
                                        <IconButton
                                            color="primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/travel/${travel.id}/team/${travel.players.find(p => p.me)?.team?.id}`);
                                            }}
                                        >
                                            {travel.editable ? <Edit /> : <Visibility />}
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <Typography fontWeight="bold">
                                            {`${travel.editable ? teamT("create_team") : teamT("team_not_created")}`}
                                        </Typography>
                                        { travel.editable && <IconButton
                                            color="primary"
                                            disabled={!travel.editable}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/travel/${travel.id}/team`);
                                            }}
                                        >
                                            <Add />
                                        </IconButton> }
                                    </>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Grid>
        </Container>

    );
};

export default Teams;
