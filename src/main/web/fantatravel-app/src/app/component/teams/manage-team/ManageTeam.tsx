import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography,
    Tooltip
} from "@mui/material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {useCreateTeam, useGetTeam, useUpdateTeam} from "../../../api/team/useTeams";
import {useGetTravel, useGetTravelers} from "../../../api/travel/useTravels";
import {AssignSpecialCategoryRequest, CreateTeamRequest} from "../../../models/models";

const Teams = () => {
    const {id, travelId: travelIdParams} = useParams<{ id?: string; travelId: string }>();
    const teamId = id ? Number(id) : undefined;
    const travelId = Number(travelIdParams);

    const {t: teamT} = useTranslation("translation", {keyPrefix: "teams"});
    const {t: specialT} = useTranslation("translation", {keyPrefix: "special_category"});
    const {t: errorT} = useTranslation("translation", {keyPrefix: "errors"});

    // API
    const {data: travelers = []} = useGetTravelers(travelId);
    const {data: travel} = useGetTravel(travelId);
    const {data: team} = useGetTeam(teamId);
    const {mutate: createTeam, error: createError, isError: isCreateError} = useCreateTeam();
    const {mutate: updateTeam, error: upadteError, isError: isUpdateError} = useUpdateTeam(teamId);

    // Form
    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: {errors},
    } = useForm<CreateTeamRequest>({
        defaultValues: {
            travelId,
            name: "",
            users: [],
            specialCategories: [],
        },
    });

    const selectedUsers = watch("users");
    const {
        fields: specialCategories,
        replace: replaceSpecialCategories,
    } = useFieldArray({
        control,
        name: "specialCategories"
    });
    const maxSelectable = Math.max(2, Math.floor(travelers.length / 2));
    const captainId = selectedUsers?.find((u) => u.captain)?.user.id;

    // Precompilazione in edit mode
    useEffect(() => {
        if (team && teamId) {
            setValue("name", team.name);
            setValue(
                "users",
                team.teamUsers.map((u) => ({
                    user: {id: u.id, firstName: u.firstName, lastName: u.lastName, email: ""},
                    captain: u.captain,
                }))
            );
            if (team.teamSpecialCategories && team.teamSpecialCategories.length > 0) {
                setValue(
                    "specialCategories",
                    team.teamSpecialCategories.map((sc) => ({
                        user: sc.travelUser ? {
                            id: sc.travelUser.id,
                            firstName: sc.travelUser.firstName,
                            lastName: sc.travelUser.lastName,
                            email: "",
                        } : {id: -1, firstName: "", lastName: "", email: ""},
                        specialCategory: {
                            id: sc.specialCategory.id,
                            travelSpecialCategoryId: sc.specialCategory.travelSpecialCategoryId,
                            name: sc.specialCategory.name,
                            description: sc.specialCategory.description,
                            selected: sc.specialCategory.selected,
                            traveler: null as any,
                        },
                    }))
                );
            } else {
                const newValues: AssignSpecialCategoryRequest[] = travel?.specialCategories ? travel?.specialCategories.map(special => ({
                    specialCategory: special,
                    user: null as any
                })) : [];
                replaceSpecialCategories(newValues);

            }
        } else {
            const newValues: AssignSpecialCategoryRequest[] = travel?.specialCategories ? travel?.specialCategories.map(special => ({
                specialCategory: special,
                user: null as any
            })) : [];
            replaceSpecialCategories(newValues);
        }
    }, [team, teamId, setValue, replaceSpecialCategories, travel?.specialCategories]);

    const onSubmit = (data: CreateTeamRequest) => {
        if (!data.users.some((u) => u.captain)) {
            alert("Devi selezionare un capitano");
            return;
        }
        data.specialCategories.forEach(request => {
                if (request.user?.id === -1) {
                    request.user = null as any;
                }
            }
        )
        if (teamId) {
            updateTeam(data);
        } else {
            createTeam(data);
        }
    };

    return (
        <Box p={1}>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Campo nome squadra */}
                <Controller
                    name="name"
                    control={control}
                    rules={{required: true}}
                    disabled={!travel?.editable}
                    render={({field}) => (
                        <TextField
                            {...field}
                            label={teamT("team_name")}
                            fullWidth
                            margin="normal"
                            error={!!errors.name}
                            helperText={errors.name && teamT("required_field")}
                        />
                    )}
                />
                <Paper sx={{p: 1, mt: 1}}>
                    <Typography variant="h6">
                        {teamT("select_members")} ({selectedUsers.length}/{maxSelectable})
                    </Typography>
                    <Divider sx={{mb: 2}}/>

                    {/* Membri e capitano */}
                    <RadioGroup
                        value={captainId || ""}
                        onChange={(e) => {
                            const newCaptainId = Number(e.target.value);
                            setValue(
                                "users",
                                selectedUsers.map((u) => ({
                                    ...u,
                                    captain: u.user.id === newCaptainId,
                                }))
                            );
                        }}
                    >
                        <Grid container spacing={2}>
                            {travelers.map((traveler) => {
                                const isSelected = selectedUsers.some((u) => u.user.id === traveler.id);
                                const maxReached = selectedUsers.length >= maxSelectable && !isSelected;

                                return (
                                    <Grid key={traveler.id}>
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            border="1px solid #ccc"
                                            borderRadius={2}
                                            p={1}
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={isSelected}
                                                        disabled={maxReached || !travel?.editable}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setValue("users", [
                                                                    ...selectedUsers,
                                                                    {
                                                                        user: {
                                                                            id: traveler.id,
                                                                            firstName: traveler.firstName,
                                                                            lastName: traveler.lastName,
                                                                            email: "",
                                                                        },
                                                                        captain: false,
                                                                    },
                                                                ]);
                                                            } else {
                                                                setValue(
                                                                    "users",
                                                                    selectedUsers.filter((u) => u.user.id !== traveler.id)
                                                                );
                                                            }
                                                        }}
                                                    />
                                                }
                                                label={`${traveler.firstName} ${traveler.lastName} ${traveler.me ? "(You)" : ""}`}
                                            />
                                            {isSelected && (
                                                <FormControlLabel
                                                    control={
                                                        <Radio
                                                            disabled={!travel?.editable}
                                                            value={traveler.id}
                                                            checked={captainId === traveler.id}
                                                            onChange={() => {
                                                            }}
                                                        />
                                                    }
                                                    label={teamT("captain")}
                                                />
                                            )}
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </RadioGroup>
                </Paper>


                {/* Special Categories */}
                <Paper sx={{p: 1, mt: 2}}>

                    <Typography variant="h6">
                        {teamT("assign_special_categories")}
                    </Typography>
                    <Box
                        sx={{display: "flex", flexDirection: "column", gap: 3}}
                    >
                        <Divider/>
                        {specialCategories.map((sc, index) => (
                            <Box key={sc.id}
                                sx={{display: "flex", flexDirection: "row", gap: 2, alignItems: 'center'}}
                            >
                                <FormControl key={sc.id} fullWidth>
                                    <InputLabel>
                                        {specialT(`name.${sc.specialCategory.name}`)}
                                    </InputLabel>

                                    <Controller
                                        name={`specialCategories.${index}.user`}
                                        control={control}
                                        disabled={!travel?.editable}
                                        render={({field}) => (
                                            <Box display="flex" flexDirection="column" gap={1}>
                                                <Select
                                                    {...field}
                                                    value={field.value?.id || ""}
                                                    label={specialT(`name.${sc.specialCategory.name}`)}
                                                    onChange={(e) => {
                                                        const selectedUser = travelers.find(
                                                            (u) => u.id === Number(e.target.value)
                                                        );
                                                        field.onChange(
                                                            selectedUser
                                                                ? {
                                                                    id: selectedUser.id,
                                                                    firstName: selectedUser.firstName,
                                                                    lastName: selectedUser.lastName,
                                                                    email: "",
                                                                }
                                                                : {id: -1}
                                                        );
                                                    }}
                                                    displayEmpty
                                                    fullWidth
                                                >
                                                    <MenuItem value={-1}>
                                                        <em>{teamT("no_travelers")}</em>
                                                    </MenuItem>
                                                    {travelers.map((traveler) => (
                                                        <MenuItem key={traveler.id} value={traveler.id}>
                                                            {traveler.firstName} {traveler.lastName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Box>
                                        )}
                                    />
                                </FormControl>
                                <Tooltip title={specialT(`description.${sc.specialCategory.description}`)}>
                                    <InfoOutlined fontSize="small" color="action"/>
                                </Tooltip>
                            </Box>
                        ))}
                    </Box>
                </Paper>

                {travel?.editable && <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {teamT("save")}
                    </Button>
                </Box>}
                {isUpdateError && (
                    <Typography variant="body2" color="error" textAlign="center" mt={2}>
                        {errorT(((upadteError as any)?.response?.data as any).error)}
                    </Typography>
                )}
                {isCreateError && (
                    <Typography variant="body2" color="error" textAlign="center" mt={2}>
                        {errorT(((createError as any)?.response?.data as any).error)}
                    </Typography>
                )}
            </form>
        </Box>
    )
        ;
};

export default Teams;
