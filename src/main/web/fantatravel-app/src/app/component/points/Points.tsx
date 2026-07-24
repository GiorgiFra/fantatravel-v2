import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    Card,
    CardContent,
    Container,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Stack,
    Typography
} from "@mui/material";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import {useGetPoints} from "../../api/point/usePoints";
import {PointsDayModel, PointsUserModel} from "../../models/models";

const Points = () => {
    const { id: travelIdParams } = useParams<{ id?: string }>();
    const travelId = Number(travelIdParams);

    const navigate = useNavigate();

    const { data: points } = useGetPoints(travelId);

    if (!points) return null;

    return (
        <Container maxWidth="md" sx={{ mt: 1, mb: 6 }}>
            {points.map((dayModel: PointsDayModel) => (
                <Card key={dayModel.day.toString()} sx={{ mb: 3 }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Typography variant="h6">
                                {new Date(dayModel.day).toLocaleDateString()}
                            </Typography>
                            <IconButton
                                color="primary"
                                onClick={() => navigate(`/travel/${travelId}/points/${dayModel.day}`)}
                            >
                                <EditCalendarIcon />
                            </IconButton>
                        </Stack>
                        <Divider/>
                        <List dense>
                            {dayModel.users.map((userModel: PointsUserModel) => (
                                <ListItem key={userModel.user.id}
                                          sx={{ py: 0}} // padding verticale più piccolo
                                >
                                    <ListItemText
                                        primary={
                                            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                                <span>#{userModel.position} {userModel.user.firstName} {userModel.user.lastName}</span>
                                                <span>{userModel.points}</span>
                                            </div>
                                        }
                                    />

                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            ))}
        </Container>
    );
};

export default Points;
