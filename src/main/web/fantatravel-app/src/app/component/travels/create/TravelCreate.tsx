import React from 'react';
import {Autocomplete, Box, Button, Container, Grid, TextField,} from '@mui/material';
import {Controller, useForm} from 'react-hook-form';
import {CreateTravelRequest, DestinationModel} from "../../../models/models";
import {useGetDestinations} from "../../../api/destination/useDestinations";
import {useTranslation} from "react-i18next";
import {useCreateTravel} from "../../../api/travel/useTravels";
import dayjs from "dayjs";

const TravelCreate = () => {
    const { data: destinations = [] } = useGetDestinations();
    const {mutateAsync: createTravel} = useCreateTravel();
    const {t: destinationT} = useTranslation('translation', {keyPrefix: 'destinations'});
    const {t: travelT} = useTranslation('translation', {keyPrefix: 'travels'});
    const {t: errorT} = useTranslation('translation', {keyPrefix: 'errors'});

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<CreateTravelRequest>();

    const onSubmit = (data: CreateTravelRequest) => {
        createTravel(data);
    };

    return (
        <Container maxWidth="sm" sx={{ paddingTop: 1 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2} flexDirection={"column"} flex={1}>
                    {/* Nome */}
                    <Grid>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: errorT("field_required") }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label={travelT('travel_name')}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                    </Grid>

                    {/* Data Inizio */}
                    <Grid>
                        <Controller
                            name="startDate"
                            control={control}
                            rules={{ required: errorT("field_required") }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    type="date"
                                    label={travelT('start_date')}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{
                                        min: dayjs(new Date()).format("YYYY-MM-DD"),
                                    }}
                                    error={!!errors.startDate}
                                    helperText={errors.startDate?.message}
                                />
                            )}
                        />
                    </Grid>

                    {/* Data Fine */}
                    <Grid >
                        <Controller
                            name="endDate"
                            control={control}
                            rules={{ required: errorT("field_required") }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    type="date"
                                    label={travelT('end_date')}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.endDate}
                                    helperText={errors.endDate?.message}
                                />
                            )}
                        />
                    </Grid>

                    {/* Destinazione con Autocomplete */}
                    <Grid >
                        <Controller
                            name="destination"
                            control={control}
                            rules={{ required: errorT("field_required") }}
                            render={({ field }) => (
                                <Autocomplete
                                    options={destinations}
                                    getOptionLabel={(option: DestinationModel) => destinationT(option.name)}
                                    onChange={(_, value) => field.onChange(value)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={travelT('destination')}
                                            error={!!errors.destination}
                                            helperText={errors.destination?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>

                    {/* Submit */}
                    <Grid >
                        <Button variant="contained" type="submit" fullWidth>
                            {travelT('create_travel')}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default TravelCreate;
