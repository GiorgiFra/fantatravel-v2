import React, {useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Container,
    FormControlLabel,
    Paper,
    Typography
} from '@mui/material';
import {useParams} from 'react-router-dom';
import {
    useGetSpecialCategoriesToLink,
    useLinkSpecialCategories
} from '../../../../api/travel/useTravels';
import {SpecialCategoryModel} from '../../../../models/models';
import {useTranslation} from "react-i18next";

const TravelManageSpecialCategories = () => {
    const { id } = useParams<{ id: string }>();
    const travelId = Number(id);

    const { data, isLoading, isError, error } = useGetSpecialCategoriesToLink(travelId);
    const { mutateAsync: linkSpecialCategories } = useLinkSpecialCategories(travelId);

    const [selectedCategories, setSelectedCategories] = useState<SpecialCategoryModel[]>([]);

    const { t: specialCategoryT } = useTranslation('translation', { keyPrefix: 'special_category' });

    React.useEffect(() => {
        if (data) {
            // Preseleziona quelle che hanno selected = true
            setSelectedCategories(data.filter(c => c.selected));
        }
    }, [data]);

    const handleToggle = (category: SpecialCategoryModel) => {
        setSelectedCategories(prev => {
            const exists = prev.some(c => c.id === category.id);
            if (exists) {
                return prev.filter(c => c.id !== category.id);
            }
            return [...prev, category];
        });
    };

    const handleSave = async () => {
        try {
            await linkSpecialCategories({specialCategories: selectedCategories});
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

    return (
        <Container maxWidth="md" sx={{ mt: 1, mb: 6, pl: 1, pr: 1 }}>
            <Paper sx={{ p: 2 }}>
                <Box display="flex" flexDirection="column" gap={1}>
                    {data?.map((category) => (
                        <FormControlLabel
                            key={category.id}
                            control={
                                <Checkbox
                                    checked={selectedCategories.some(c => c.id === category.id)}
                                    onChange={() => handleToggle(category)}
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="subtitle1">
                                        {specialCategoryT(`name.${category.name}`)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {specialCategoryT(`description.${category.description}`)}
                                    </Typography>
                                </Box>
                            }
                        />
                    ))}
                </Box>

                <Box mt={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSave}
                    >
                        Salva
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default TravelManageSpecialCategories;
