import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import {useAddPoints, useGetPointsByDay, useNotSelectableTravelers} from "../../../api/point/usePoints";
import {useGetTravel, useGetTravelers} from "../../../api/travel/useTravels";
import {Box, Button, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Divider} from "@mui/material";
import dayjs from 'dayjs';
import {AddPointRequest, RuleModel, TravelUserModel} from "../../../models/models";
import {formatDate} from "../../../utils/date-formatter";

const AddPoints = () => {
    const { id: travelIdParams, day } = useParams<{ id: string, day: string }>();
    const travelId = Number(travelIdParams);
    const { t: travelT, i18n } = useTranslation("translation", { keyPrefix: "travels" });
    const { t: commonT } = useTranslation("translation", { keyPrefix: "commons" });
    const { t: ruleT } = useTranslation("translation", { keyPrefix: "rules" });
    const { t: errorT } = useTranslation("translation", { keyPrefix: "errors" });

    const navigate = useNavigate();
    const { mutateAsync: addPoints } = useAddPoints();
    const { data: points } = useGetPointsByDay(travelId, day);
    const { data: notSelectableTravelers } = useNotSelectableTravelers(travelId, day);

    const { data: travel } = useGetTravel(travelId);
    const { data: travelers } = useGetTravelers(travelId);

    const { control, handleSubmit, setValue,
        formState: { errors },
    } = useForm<AddPointRequest>({
        defaultValues: {
            travelId: travelId,
            day: day as any,
            rules: []
        }
    });

    useEffect(() => {
        if(points) {
            setValue('rules', points.rules);
        }
    }, [points, setValue]);

    const onSubmit = async (data: AddPointRequest) => {
        await addPoints(data, {
            onSuccess: () => {
                navigate(`/travel/${travelId}/points`);
            },
            onError: (error) => {
                console.error("Errore durante l'aggiunta dei punti:", error);
            }
        });
    };

    const isTravelerDisabled = (traveler: TravelUserModel, rule: RuleModel) => {
        const isSelected = notSelectableTravelers?.some(nt =>
            nt.rule.id === rule.id && nt.users.some(u => u.id === traveler.id)
        );
        return isSelected;
    }

    if (!travel || !travelers) return null;

    return (
        <Container maxWidth="md" sx={{mt: 1, mb: 6}}>
            {travel.admin ? (
                // --- Admin: può modificare e salvare ---
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                    <Controller
                        name="day"
                        control={control}
                        rules={{ required: errorT("field_required") }}
                        render={({ field }) => (
                            <TextField
                                disabled
                                {...field}
                                fullWidth
                                type="date"
                                label={travelT('start_date')}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{
                                    min: dayjs(travel.startDate).format("YYYY-MM-DD"),
                                    max: dayjs(travel.endDate).format("YYYY-MM-DD")
                                }}
                                error={!!errors.day}
                                helperText={errors.day?.message}
                            />
                        )}
                    />

                    {travel.rules?.map((rule: RuleModel, index: number) => (
                        <FormControl fullWidth key={rule.id}>
                            <InputLabel>{`${ruleT(rule.description)} (${rule.value}) ${rule.repeatable ? "(R)" : ""}`}</InputLabel>
                            <Controller
                                name={`rules.${index}.users`}
                                control={control}
                                render={({ field }) => {
                                    const selectedIds = (field.value || []).map((u: TravelUserModel) => u.id);

                                    return (
                                        <Select
                                            multiple
                                            label={`${ruleT(rule.description)} (${rule.value})`}
                                            value={selectedIds}
                                            onChange={(e) => {
                                                const ids = e.target.value as number[];
                                                const selectedUsers = travelers.filter((u: TravelUserModel) =>
                                                    ids.includes(u.id)
                                                );
                                                field.onChange(selectedUsers);
                                            }}
                                            renderValue={() =>
                                                (field.value || [])
                                                    .map((u: TravelUserModel) => `${u.firstName} ${u.lastName}`)
                                                    .join(", ")
                                            }
                                        >
                                            {travelers.map((traveler: TravelUserModel) => (
                                                <MenuItem key={traveler.id} value={traveler.id} disabled={isTravelerDisabled(traveler, rule)}>
                                                    {traveler.firstName} {traveler.lastName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    );
                                }}
                            />
                        </FormControl>
                    ))}

                    <Button type="submit" variant="contained" color="primary">
                        {commonT("save")}
                    </Button>
                </Box>
            ) : (
                // --- Non Admin: sola visualizzazione ---
                <Box display="flex" flexDirection="column" gap={3}>
                    <Typography variant="h6">
                        {formatDate(day!, i18n.language)}
                    </Typography>
                    {travel.rules?.map((rule: RuleModel) => (<>
                        <Box key={rule.id}>
                            <Typography variant="subtitle1">
                                {`${ruleT(rule.description)} (${rule.value}) ${rule.repeatable ? "(R)" : ""}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {points?.rules
                                    ?.find(r => r.rule.id === rule.id)
                                    ?.users.map(u => `${u.firstName} ${u.lastName}`)
                                    .join(", ") || "-"}
                            </Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        </>
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default AddPoints;
