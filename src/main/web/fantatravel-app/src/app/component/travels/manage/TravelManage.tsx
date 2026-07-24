import React, {useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    Fab,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import LoopIcon from '@mui/icons-material/Loop';
import ShareIcon from "@mui/icons-material/Share";
import MoneyIcon from "@mui/icons-material/Money";
import GradingIcon from "@mui/icons-material/Grading";
import {useTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router-dom';
import {useGetTravel, useLinkUser} from "../../../api/travel/useTravels";
import Snackbar from "@mui/material/Snackbar";
import {formatDate} from "../../../utils/date-formatter";
import {useGetTotalPoints, useGetTotalPointsPlayers} from "../../../api/point/usePoints";
import {PointsUserModel} from "../../../models/models";
import PlayerItem from "./player-item/PlayerItem";

interface TravelManageProps {
    linkUser?: boolean;
    role?: 'TRAVELER' | 'PLAYER';
}

const TravelManage: React.FC<TravelManageProps> = ({linkUser, role}) => {
    const {id} = useParams<{ id: string }>();
    const travelId = Number(id);
    const {t: rulesT, i18n} = useTranslation('translation', {keyPrefix: 'rules'});
    const {t: specialCategoryT} = useTranslation('translation', {keyPrefix: 'special_category'});
    const {t: travelT} = useTranslation('translation', {keyPrefix: 'travels'});
    const {t: destinationT} = useTranslation('translation', {keyPrefix: 'destinations'});
    const {data: travel, isLoading} = useGetTravel(travelId);
    const {data: travelersTable} = useGetTotalPoints(travelId);
    const {data: playersTable} = useGetTotalPointsPlayers(travelId);
    const {mutateAsync: linkUserFunction} = useLinkUser(travelId);
    const navigate = useNavigate();
    const [showAllRules, setShowAllRules] = useState(false);
    const [showAllSpecialCategories, setShowAllSpecialCategories] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    if (isLoading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress/></Box>;
    if (!travel) return null;

    const handleShare = async (e: React.MouseEvent, travelId: number, travelName: string, path: string) => {
        e.stopPropagation();
        const shareUrl = `${window.location.origin}/fantatravel/app/travels/${travelId}/${path}`;
        const shareData = {
            title: "FantaTravel",
            text: `${path === 'link-traveler' ? travelT('share_travel_link_traveler') : travelT('share_travel_link_player')}`,
            url: shareUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Errore condivisione:", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareUrl);
                setSnackbarOpen(true);
            } catch (err) {
                console.error("Errore copia link:", err);
            }
        }
    };

    return (
        <Container maxWidth="md" sx={{mt: 1, mb: 6}}>

            <Paper variant="outlined" sx={{p: 3, mb: 4}}>
                <Typography variant="h6" gutterBottom>
                    {travelT('travel_details')}
                </Typography>
                <Divider sx={{mb: 2}}/>

                <Grid container spacing={2}>
                    <Grid>
                        <Typography variant="subtitle2">{travelT('travel_name')}</Typography>
                        <Typography>{travel.name}</Typography>
                    </Grid>

                    <Grid>
                        <Typography variant="subtitle2">{travelT('date')}</Typography>
                        {formatDate(travel.startDate, i18n.language)} → {formatDate(travel.endDate, i18n.language)}
                    </Grid>
                    <Grid>
                        <Typography variant="subtitle2">{travelT('destination')}</Typography>
                        <Typography>{destinationT(travel.destination.name)}</Typography>
                    </Grid>
                </Grid>
            </Paper>

            {!linkUser && (<>
                    <Paper variant="outlined" sx={{p: 3, mb: 4, position: 'relative'}}>
                        <Box
                            sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                zIndex: 10,
                            }}
                        >
                            <Box sx={{display: 'flex', gap: 1}}>
                                <IconButton
                                    onClick={(e) => navigate(`/travel/${travelId}/points`)}
                                    size="small"
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'primary.main',
                                        color: 'primary.main',
                                        backgroundColor: 'transparent',
                                    }}
                                >
                                    <MoneyIcon fontSize="small"/>
                                </IconButton>
                                {travel.admin && travel.editable ? (<IconButton
                                        onClick={(e) => handleShare(e, travel.id, travel.name, 'link-traveler')}
                                        size="small"
                                        sx={{
                                            border: '1px solid',
                                            borderColor: 'primary.main',
                                            color: 'primary.main',
                                            backgroundColor: 'transparent',
                                        }}
                                    >
                                        <ShareIcon fontSize="small"/>
                                    </IconButton>
                                ) : null}
                            </Box>

                        </Box>
                        <Typography variant="h6" gutterBottom>{travelT('travelers')}</Typography>

                        <Divider sx={{mb: 2}}/>

                        {travelersTable && travelersTable.length > 0 ? (
                            <List dense>
                                {travelersTable.map((userModel: PointsUserModel) => (
                                    <ListItem key={userModel.user.id}
                                              sx={{py: 0}} // padding verticale più piccolo
                                    >
                                        <ListItemText
                                            primary={
                                                <div style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    width: "100%"
                                                }}>
                                                    <span>#{userModel.position} {userModel.user.firstName} {userModel.user.lastName}</span>
                                                    <span>{userModel.points}</span>
                                                </div>
                                            }
                                        />

                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography color="text.secondary">Nessun viaggiatore presente.</Typography>
                        )}

                        <Snackbar
                            open={snackbarOpen}
                            autoHideDuration={3000}
                            onClose={() => setSnackbarOpen(false)}
                            message="Link copiato negli appunti"
                        />
                    </Paper>

                    <Paper variant="outlined" sx={{p: 3, mb: 4, position: 'relative'}}>
                        <Box
                            sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                zIndex: 10,
                            }}
                        >
                            {travel.admin && travel.editable ? (
                                <IconButton
                                    onClick={(e) => handleShare(e, travel.id, travel.name, 'link-player')}
                                    size="small"
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'primary.main',
                                        color: 'primary.main',
                                        backgroundColor: 'transparent',
                                    }}
                                >
                                    <ShareIcon fontSize="small"/>
                                </IconButton>
                            ) : null}
                        </Box>
                        <Typography variant="h6" gutterBottom>{travelT('players')}</Typography>
                        <Divider sx={{mb: 2}}/>
                        {playersTable && playersTable.length > 0 ? (
                            <List dense>
                                {playersTable.map((userModel: PointsUserModel) => (
                                    <PlayerItem userModel={userModel} key={userModel.user.id}
                                                viewTeam={!travel.editable} viewSpecial={travel.reviewed}/>
                                ))}
                            </List>
                        ) : (
                            <Typography color="text.secondary">Nessun viaggiatore presente.</Typography>
                        )}

                        <Snackbar
                            open={snackbarOpen}
                            autoHideDuration={3000}
                            onClose={() => setSnackbarOpen(false)}
                            message="Link copiato negli appunti"
                        /> </Paper>

                    <Paper variant="outlined" sx={{p: 3, mb: 4, position: 'relative'}}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">{travelT('rules')}</Typography>
                            {travel.admin && travel.editable ? (
                                <IconButton size="small" aria-label="Modifica regole"
                                            onClick={() => navigate(`/travels/${travelId}/rules`)}>
                                    <EditIcon fontSize="small"/>
                                </IconButton>
                            ) : null}
                        </Box>
                        <Divider sx={{mb: 2}}/>

                        {travel.rules?.length > 0 ? (
                            <Box component="ul" sx={{pl: 2, m: 0}}>
                                {(showAllRules ? travel.rules : travel.rules.slice(0, 2)).map((rule, index) => (
                                    <li key={index} style={{position: 'relative', paddingRight: '24px'}}>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {rulesT(rule.description)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {rulesT('value')}: {rule.value}
                                            </Typography>
                                        </Box>

                                        {rule.repeatable && (
                                            <LoopIcon
                                                fontSize="small"
                                                color="action"
                                                titleAccess={rulesT('repeatable')}
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    right: 0,
                                                }}
                                            />
                                        )}
                                    </li>

                                ))}

                                {travel.rules.length > 2 && (
                                    <Box mt={2}>
                                        <Typography
                                            variant="body2"
                                            color="primary"
                                            sx={{cursor: 'pointer'}}
                                            onClick={() => setShowAllRules(prev => !prev)}
                                        >
                                            {showAllRules ? travelT('show_less') : `${travelT('show_all')} (${travel.rules.length})`}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            <Typography color="text.secondary">{travelT('no_rules')}</Typography>
                        )}
                    </Paper>

                    <Paper variant="outlined" sx={{p: 3, mb: 4, position: 'relative'}}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">{travelT('special_categories')}</Typography>
                            {travel.admin && travel.editable ? (
                                <IconButton size="small" aria-label="Modifica categorie speciali"
                                            onClick={() => navigate(`/travels/${travelId}/special-categories`)}>
                                    <EditIcon fontSize="small"/>
                                </IconButton>
                            ) : null}
                        </Box>
                        <Divider sx={{mb: 2}}/>

                        {travel.specialCategories?.length > 0 ? (
                            <Box component="ul" sx={{pl: 2, m: 0}}>
                                {(showAllSpecialCategories ? travel.specialCategories : travel.specialCategories.slice(0, 2)).map((sc, index) => (
                                    <li key={index} style={{position: 'relative', paddingRight: '24px'}}>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {
                                                    travel.reviewed ? `${specialCategoryT(`name.${sc.name}`)} (${sc.traveler ? `${sc.traveler.firstName} ${sc.traveler.lastName}` : `${travelT('no_travelers')}`})`
                                                        : `${specialCategoryT(`name.${sc.name}`)}`
                                                }

                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {specialCategoryT(`description.${sc.description}`)}
                                            </Typography>
                                        </Box>
                                    </li>

                                ))}

                                {travel.specialCategories.length > 2 && (
                                    <Box mt={2}>
                                        <Typography
                                            variant="body2"
                                            color="primary"
                                            sx={{cursor: 'pointer'}}
                                            onClick={() => setShowAllSpecialCategories(prev => !prev)}
                                        >
                                            {showAllSpecialCategories ? travelT('show_less') : `${travelT('show_all')} (${travel.specialCategories.length})`}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            <Typography color="text.secondary">{travelT('no_special')}</Typography>
                        )}
                    </Paper>

                    {travel.reviewed ? (
                        <Paper variant="outlined" sx={{p: 3}}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">{travelT('review_comment')}</Typography>
                            </Box>
                            <Divider sx={{mb: 2}}/>
                            <Typography variant="subtitle2" fontWeight="bold">
                                {travel.reviewedComment}
                            </Typography>
                        </Paper>) : (
                        travel.admin && < Fab
                            color="primary"
                            aria-label="review"
                            style={{position: "fixed", bottom: 80, right: 16}}
                            onClick={() => {
                                navigate(`/travel/${travelId}/review`);
                            }}
                        >
                            <GradingIcon/>
                        </Fab>
                    )

                    }
                </>
            )}
            {linkUser && role && (
                <Grid>
                    <Button variant="contained" onClick={() => linkUserFunction(role)} fullWidth>
                        {travelT('participate')}
                    </Button>
                </Grid>
            )}


        </Container>
    );
};

export default TravelManage;
