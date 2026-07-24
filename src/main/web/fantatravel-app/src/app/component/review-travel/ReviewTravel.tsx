import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {
    Box,
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {useGetSpecialCategories, useGetTravel, useGetTravelers, useReview} from "../../api/travel/useTravels";
import {ReviewedTravelRequest, TravelUserModel} from "../../models/models";

const ReviewTravel = () => {
    const {id: travelIdParams} = useParams<{ id: string }>();
    const travelId = Number(travelIdParams);
    const {t: travelT} = useTranslation("translation", {keyPrefix: "travels"});
    const {t: commonT} = useTranslation("translation", {keyPrefix: "commons"});
    const {t: specialT} = useTranslation("translation", {keyPrefix: "special_category"});
    const {t: errorT} = useTranslation("translation", {keyPrefix: "errors"});

    const {mutateAsync: review, error, isError} = useReview(travelId);
    const {data: specials} = useGetSpecialCategories(travelId);
    const {data: travel} = useGetTravel(travelId);
    const {data: travelers} = useGetTravelers(travelId);

    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<ReviewedTravelRequest>({
        defaultValues: {
            assignSpecialCategories: [],
            comment: ""
        }
    });

    const {
        fields: assignSpecialCategories,
        replace: replaceAssignSpecialCategory
    } = useFieldArray({
        control,
        name: "assignSpecialCategories"
    });

    useEffect(() => {
        if (specials && assignSpecialCategories.length === 0) {
            const newValues = specials.map(special => ({
                specialCategory: special,
                user: null as any
            }));
            replaceAssignSpecialCategory(newValues);
        }
    }, [specials, replaceAssignSpecialCategory, assignSpecialCategories.length]);


    const onSubmit = async (data: ReviewedTravelRequest) => {
        data.assignSpecialCategories.forEach(request => {
                if (request.user.id === -1) {
                    request.user = null as any;
                }
            }
        )
        await review(data, {
            onError: (error) => {
                console.error("Errore durante la review:", error);
            }
        });
    };

    if (!travel || !travelers) return null;

    return (
        <Container maxWidth="md" sx={{mt: 2, mb: 6}}>
            <Paper sx={{p: 3}}>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{display: "flex", flexDirection: "column", gap: 3}}
                >
                    {/* Commento */}
                    <Controller
                        name="comment"
                        control={control}
                        rules={{required: errorT("field_required")}}
                        render={({field}) => (
                            <TextField
                                {...field}
                                label={travelT("review_comment")}
                                multiline
                                rows={4}
                                fullWidth
                                error={!!errors.comment}
                                helperText={errors.comment?.message}
                            />
                        )}
                    />

                    {/* Lista categorie speciali */}
                    {assignSpecialCategories.map((field, index) => (
                        <FormControl key={field.id} fullWidth>
                            <InputLabel>
                                {specialT(`name.${field.specialCategory.name}`)}
                            </InputLabel>
                            <Controller
                                name={`assignSpecialCategories.${index}.user`}
                                control={control}
                                render={({field: userField}) => (
                                    <Select
                                        {...userField}
                                        label={specialT(`name.${field.specialCategory.name}`)}
                                        value={userField.value?.id || ""}
                                        onChange={(e) => {
                                            if (e.target.value !== -1) {
                                                const selectedUser = travelers.find(
                                                    (u: TravelUserModel) => u.id === e.target.value
                                                );
                                                userField.onChange(selectedUser || null);
                                            } else {
                                                userField.onChange({firstName: travelT('no_travelers'), id: -1});
                                            }
                                        }}
                                    >
                                        <MenuItem value={-1}>
                                            <em>{travelT("no_travelers")}</em>
                                        </MenuItem>
                                        {travelers.map((traveler: TravelUserModel) => (
                                            <MenuItem key={traveler.id} value={traveler.id}>
                                                {traveler.firstName} {traveler.lastName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>
                    ))}

                    <Button type="submit" variant="contained" color="primary">
                        {commonT("save")}
                    </Button>
                    {isError && (
                        <Typography variant="body2" color="error" textAlign="center" mt={2}>
                            {errorT((error?.response?.data as any).error)}
                        </Typography>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default ReviewTravel;
