import React, {useState} from "react";
import {Divider, List, ListItem as MUIListItem, ListItem, ListItemText, Popover, Typography} from "@mui/material";
import {PointsUserModel} from "../../../../models/models";
import {useTranslation} from "react-i18next";

interface PlayerItemProps {
    userModel: PointsUserModel;
    viewTeam?: boolean
    viewSpecial: boolean
}

const PlayerItem: React.FC<PlayerItemProps> = ({userModel, viewTeam, viewSpecial}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const {t: specialCategoryT} = useTranslation('translation', {keyPrefix: 'special_category'});
    const {t: travelT} = useTranslation("translation", {keyPrefix: "travels"});

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <ListItem sx={{py: 0}}>
                <ListItemText
                    primary={
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%"
                            }}
                        >
              <span>
                #{userModel.position} {userModel.user.firstName}{" "}
                  {userModel.user.lastName}
              </span>
                            <span>{userModel.points}</span>
                        </div>
                    }
                    secondary={
                        userModel.user.team && (
                            <Typography
                                variant="body2"
                                color="primary"
                                sx={{cursor: "pointer", textDecoration: "underline"}}
                                onClick={(event) => viewTeam ? handleOpen(event) : () => {
                                }}
                            >
                                {userModel.user.team.name}
                            </Typography>
                        )
                    }
                />
            </ListItem>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                }}
            >
                <List dense sx={{p: 1, minWidth: 200}}>
                    {userModel.user.team?.teamUsers?.map((teamUser) => (
                        <MUIListItem key={teamUser.id} sx={{py: 0.5}}>
                            <Typography variant="body2">
                                {teamUser.firstName} {teamUser.lastName} {teamUser.captain ? "(Cap.)" : ""}
                            </Typography>
                        </MUIListItem>
                    ))}
                </List>
                {viewSpecial &&
                    <>
                        <Divider/>
                        <List dense sx={{p: 1, minWidth: 200}}>
                            {userModel.user.team?.teamSpecialCategories?.map((teamSC) => (
                                <MUIListItem key={teamSC.id} sx={{py: 0.5}}>
                                    <Typography variant="body2">
                                        {`${specialCategoryT(`name.${teamSC.specialCategory.name}`)} (${teamSC.travelUser ? `${teamSC.travelUser.firstName} ${teamSC.travelUser.lastName}` : travelT('no_travelers')})`}
                                    </Typography>
                                </MUIListItem>
                            ))}
                        </List>
                    </>
                }˙
            </Popover>
        </>
    );
}

export default PlayerItem;
