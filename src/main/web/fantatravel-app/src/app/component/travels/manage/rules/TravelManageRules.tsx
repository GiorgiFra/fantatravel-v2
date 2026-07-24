import React, {useEffect, useState} from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Container,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import {useParams} from 'react-router-dom';
import {useGetRulesToLink, useLinkRules} from '../../../../api/travel/useTravels';
import {RuleModel} from '../../../../models/models';
import {useGetCategories} from '../../../../api/category/useCategories';
import {useTranslation} from "react-i18next";

const TravelManageRules = () => {
    const { id } = useParams<{ id: string }>();
    const travelId = Number(id);
    const { data, isLoading, isError, error } = useGetRulesToLink(travelId);
    const { data: categories } = useGetCategories();
    const { mutateAsync: linkRules } = useLinkRules(travelId);

    const [rules, setRules] = useState<RuleModel[]>([]);
    const [inputValues, setInputValues] = useState<Record<number, string>>({});
    const [valueErrors, setValueErrors] = useState<Record<number, boolean>>({});

    const [newRuleDescription, setNewRuleDescription] = useState('');
    const [newRuleValue, setNewRuleValue] = useState('0');
    const [newRuleRepeatable, setNewRuleRepeatable] = useState(false);
    const [newRuleCategoryId, setNewRuleCategoryId] = useState<number | ''>('');
    const [newRuleError, setNewRuleError] = useState(false);

    const {t: rulesT} = useTranslation('translation', {keyPrefix: 'rules'});
    const {t: categoryT} = useTranslation('translation', {keyPrefix: 'categories'});

    useEffect(() => {
        if (data) {
            setRules(data);
            const initialInputs: Record<number, string> = {};
            data.forEach(rule => {
                initialInputs[rule.id] = String(rule.value);
            });
            setInputValues(initialInputs);
        }
    }, [data]);

    const toggleSelected = (id: number) => {
        setRules(prev =>
            prev.map(rule =>
                rule.id === id ? { ...rule, selected: !rule.selected } : rule
            )
        );
    };

    const updateValue = (id: number, value: number) => {
        setRules(prev =>
            prev.map(rule =>
                rule.id === id ? { ...rule, value } : rule
            )
        );
    };

    const toggleRepeatable = (id: number) => {
        setRules(prev =>
            prev.map(rule =>
                rule.id === id ? { ...rule, repeatable: !rule.repeatable } : rule
            )
        );
    };

    const handleInputChange = (id: number, val: string) => {
        setInputValues(prev => ({ ...prev, [id]: val }));
        const parsed = Number(val);

        if (val === '' || val === '-') {
            setValueErrors(prev => ({ ...prev, [id]: false }));
            return;
        }

        if (isNaN(parsed)) {
            setValueErrors(prev => ({ ...prev, [id]: true }));
        } else {
            setValueErrors(prev => ({ ...prev, [id]: false }));
            updateValue(id, parsed);
        }
    };

    const handleNewRuleValueChange = (val: string) => {
        setNewRuleValue(val);
        const parsed = Number(val);
        if (val === '' || val === '-') {
            setNewRuleError(false);
            return;
        }
        setNewRuleError(isNaN(parsed));
    };

    const handleAddNewRule = () => {
        if (!newRuleDescription.trim()) {
            alert('La descrizione è obbligatoria');
            return;
        }
        if (newRuleError) {
            alert('Valore numerico non valido');
            return;
        }
        if (newRuleCategoryId === '') {
            alert('Seleziona una categoria');
            return;
        }

        const newRule: RuleModel = {
            id: null as any,
            travelRuleId: null as any,
            description: newRuleDescription,
            value: Number(newRuleValue),
            repeatable: newRuleRepeatable,
            selected: true,
            category: categories?.find(c => c.id === newRuleCategoryId) ?? null as any,
            destinations: [],
        } as RuleModel;

        setRules(prev => [...prev, newRule]);

        // reset form
        setNewRuleDescription('');
        setNewRuleValue('0');
        setNewRuleRepeatable(false);
        setNewRuleCategoryId('');
        setNewRuleError(false);
    };

    const handleSave = async () => {
        const selectedRules = rules.filter(r => r.selected);
        console.log('Salvataggio regole:', selectedRules);
        await linkRules({ rules: selectedRules });
    };

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

    return (
        <Container maxWidth="md" sx={{ mt: 1, mb: 6, pl:1, pr:1}}>
            <Paper sx={{ p: 2 }}>
                {/* Form nuova regola */}
                <Accordion
                    elevation={0}
                    sx={{
                        border: '1px solid #ffffff',
                        borderRadius: 2,
                        mb: 3,
                        boxShadow: '0px 2px 6px rgba(0,0,0,0.1)',
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="new-rule-content"
                        id="new-rule-header"
                    >
                        <Typography variant="subtitle1">{rulesT('add_new_rule')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TextField
                            label={rulesT('description')}
                            value={newRuleDescription}
                            onChange={e => setNewRuleDescription(e.target.value)}
                            size="small"
                            fullWidth
                            sx={{ mb: 2 }}
                        />

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <FormControl size="small" sx={{ flex: 1 }}>
                                <InputLabel id="select-category-label">Categoria</InputLabel>
                                <Select
                                    labelId="select-category-label"
                                    value={newRuleCategoryId}
                                    label={rulesT('category')}
                                    onChange={e => setNewRuleCategoryId(Number(e.target.value))}
                                >
                                    {categories?.map(cat => (
                                        <MenuItem key={cat.id} value={cat.id}>
                                            {categoryT(cat.description)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label={rulesT('value')}
                                value={newRuleValue}
                                onChange={e => handleNewRuleValueChange(e.target.value)}
                                size="small"
                                error={newRuleError}
                                helperText={newRuleError ? rulesT('insert_valid_number') : ''}
                                sx={{ width: 120 }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={newRuleRepeatable}
                                    onChange={e => setNewRuleRepeatable(e.target.checked)}
                                />
                            }
                            label={rulesT('repeatable')}
                        />
                        </Box>
                        <Button variant="outlined" fullWidth onClick={handleAddNewRule} sx={{ mt: 2}}>
                            {rulesT('add')}
                        </Button>
                    </AccordionDetails>
                </Accordion>

                {/* Lista regole esistenti */}
                {rules.map((rule, idx) => (
                    <Box
                        key={rule.id ?? `new-${idx}`}
                        sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={rule.selected}
                                    onChange={() => toggleSelected(rule.id!)}
                                />
                            }
                            label={
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                    {rulesT(rule.description)}
                                </Typography>
                            }
                        />

                        {rule.selected && (
                            <Box
                                sx={{
                                    mt: 1,
                                    pl: 3,
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <TextField
                                    label={rulesT('value')}
                                    value={
                                        rule.id
                                            ? inputValues[rule.id] ?? ''
                                            : String(rule.value)
                                    }
                                    onChange={e =>
                                        rule.id
                                            ? handleInputChange(rule.id, e.target.value)
                                            : null
                                    }
                                    size="small"
                                    sx={{ width: 120 }}
                                    error={!!(rule.id && valueErrors[rule.id])}
                                    helperText={
                                        rule.id && valueErrors[rule.id]
                                            ? rulesT('insert_valid_number')
                                            : ''
                                    }
                                    disabled={!rule.id}
                                />

                                {rule.category && (
                                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                        {rulesT('category')}: {categoryT(rule.category.description)}
                                    </Typography>
                                )}

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={rule.repeatable}
                                            onChange={() =>
                                                toggleRepeatable(rule.id!)
                                            }
                                        />
                                    }
                                    label={rulesT('repeatable')}
                                />
                            </Box>
                        )}
                    </Box>
                ))}

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

export default TravelManageRules;
