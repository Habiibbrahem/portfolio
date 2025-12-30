// src/components/admin/ServicesManager.tsx
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    CircularProgress,
    Paper,
    IconButton,
    Grid,
    MenuItem,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    PhotoCamera as PhotoCameraIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import { uploadImage } from '../../api/upload';
import api from '../../api/client';

interface ServiceItem {
    id: string;
    title: string;
    description: string;
    backgroundImage: string;
    icon: string; // New: icon name (e.g., "Construction", "Build", "DesignServices")
}

interface ServicesSection {
    _id?: string;
    section: 'services';
    data: {
        services: ServiceItem[];
    };
    published: boolean;
}

const iconOptions = [
    { value: 'Construction', label: 'Construction (Hard Hat)' },
    { value: 'Build', label: 'Build (Tools)' },
    { value: 'DesignServices', label: 'Design Services' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'HomeRepairService', label: 'Home Repair' },
    { value: 'Architecture', label: 'Architecture' },
    { value: 'Handyman', label: 'Handyman' },
    { value: 'Roofing', label: 'Roofing' },
];

const getServices = async (): Promise<ServicesSection> => {
    try {
        const { data } = await api.get('/cms/services');
        return data;
    } catch (err: any) {
        if (err.response?.status === 404) {
            const { data } = await api.post('/cms', {
                section: 'services',
                data: { services: [] },
                published: true,
            });
            return data;
        }
        throw err;
    }
};

const updateServices = async (updatedData: { services: ServiceItem[] }) => {
    const { data } = await api.patch('/cms/services', { data: updatedData });
    return data;
};

export default function ServicesManager() {
    const queryClient = useQueryClient();
    const [savedServices, setSavedServices] = useState<ServiceItem[]>([]);
    const [draftService, setDraftService] = useState<ServiceItem | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const { data: servicesSection, isLoading } = useQuery<ServicesSection>({
        queryKey: ['services'],
        queryFn: getServices,
    });

    const mutation = useMutation({
        mutationFn: updateServices,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            setSuccess('Services saved successfully!');
            setTimeout(() => setSuccess(''), 4000);
        },
        onError: () => {
            setError('Failed to save. Please try again.');
            setTimeout(() => setError(''), 5000);
        },
    });

    useEffect(() => {
        if (servicesSection?.data?.services) {
            // Ensure old services have icon (default to first)
            const services = servicesSection.data.services.map((s: any) => ({
                ...s,
                icon: s.icon || 'Construction',
            }));
            setSavedServices(services);
        }
    }, [servicesSection]);

    const startNewService = () => {
        setDraftService({
            id: Date.now().toString(),
            title: '',
            description: '',
            backgroundImage: '',
            icon: 'Construction',
        });
    };

    const cancelNewService = () => {
        setDraftService(null);
    };

    const createService = () => {
        if (!draftService || !draftService.title.trim()) {
            setError('Title is required');
            return;
        }

        const newList = [...savedServices, draftService];
        mutation.mutate({ services: newList });
        setSavedServices(newList);
        setDraftService(null);
    };

    const startEditing = (id: string) => {
        setEditingId(id);
    };

    const cancelEditing = () => {
        setEditingId(null);
    };

    const updateService = (id: string, field: keyof ServiceItem, value: string) => {
        const newList = savedServices.map((s) =>
            s.id === id ? { ...s, [field]: value } : s
        );
        setSavedServices(newList);
        mutation.mutate({ services: newList });
    };

    const removeService = (id: string) => {
        const newList = savedServices.filter((s) => s.id !== id);
        setSavedServices(newList);
        mutation.mutate({ services: newList });
        setSuccess('Service deleted');
        setTimeout(() => setSuccess(''), 4000);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string, isDraft: boolean = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSuccess('Uploading image...');
        try {
            const url = await uploadImage(file);

            if (isDraft && draftService) {
                setDraftService({ ...draftService, backgroundImage: url });
            } else {
                const newList = savedServices.map((s) =>
                    s.id === id ? { ...s, backgroundImage: url } : s
                );
                setSavedServices(newList);
                mutation.mutate({ services: newList });
            }
            setSuccess('Image uploaded!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Image upload failed');
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Paper elevation={4} sx={{ p: { xs: 4, md: 6 }, maxWidth: 1400, mx: 'auto', borderRadius: 4 }}>
            <Typography variant="h4" fontWeight="bold" color="primary.main" mb={5}>
                Services Manager
            </Typography>

            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {mutation.isPending && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    Saving...
                </Alert>
            )}

            {/* Add New Service Button */}
            {!draftService && (
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={startNewService}
                    sx={{ mb: 5 }}
                >
                    Add New Service
                </Button>
            )}

            {/* New Service Form */}
            {draftService && (
                <Paper elevation={6} sx={{ p: 4, mb: 5, borderRadius: 3, bgcolor: 'background.paper' }}>
                    <Typography variant="h6" color="primary.main" mb={3}>
                        Creating New Service
                    </Typography>

                    <TextField
                        label="Service Title *"
                        fullWidth
                        value={draftService.title}
                        onChange={(e) => setDraftService({ ...draftService, title: e.target.value })}
                        margin="normal"
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        select
                        label="Icon"
                        fullWidth
                        value={draftService.icon}
                        onChange={(e) => setDraftService({ ...draftService, icon: e.target.value })}
                        margin="normal"
                        sx={{ mb: 3 }}
                    >
                        {iconOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={5}
                        value={draftService.description}
                        onChange={(e) => setDraftService({ ...draftService, description: e.target.value })}
                        margin="normal"
                        sx={{ mb: 4 }}
                    />

                    <Box sx={{ mb: 4 }}>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<PhotoCameraIcon />}
                        >
                            Upload Background Image
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, draftService.id, true)}
                            />
                        </Button>

                        {draftService.backgroundImage && (
                            <Box sx={{ mt: 3, maxWidth: 600, borderRadius: 2, overflow: 'hidden' }}>
                                <img
                                    src={draftService.backgroundImage}
                                    alt="Preview"
                                    style={{ width: '100%', display: 'block', borderRadius: 8 }}
                                />
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={createService}
                            disabled={!draftService.title.trim()}
                        >
                            Create Service
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            onClick={cancelNewService}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Paper>
            )}

            {/* Existing Services */}
            <Typography variant="h5" color="text.primary" mb={3}>
                Existing Services ({savedServices.length})
            </Typography>

            {savedServices.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 8 }}>
                    No services yet. Click "Add New Service" to create one.
                </Typography>
            ) : (
                <Grid container spacing={4}>
                    {savedServices.map((service) => (
                        <Grid item xs={12} key={service.id}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 4,
                                    borderRadius: 3,
                                    position: 'relative',
                                    bgcolor: 'background.paper',
                                }}
                            >
                                <Box sx={{ display: 'flex', gap: 2, position: 'absolute', top: 16, right: 16 }}>
                                    {editingId === service.id ? (
                                        <>
                                            <IconButton color="success" onClick={() => setEditingId(null)}>
                                                <SaveIcon />
                                            </IconButton>
                                            <IconButton color="warning" onClick={() => setEditingId(null)}>
                                                <CancelIcon />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <IconButton color="primary" onClick={() => startEditing(service.id)}>
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                    <IconButton
                                        color="error"
                                        onClick={() => removeService(service.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>

                                <TextField
                                    label="Service Title"
                                    fullWidth
                                    value={service.title}
                                    onChange={(e) => updateService(service.id, 'title', e.target.value)}
                                    margin="normal"
                                    disabled={editingId !== service.id}
                                    sx={{ mb: 3 }}
                                />

                                <TextField
                                    select
                                    label="Icon"
                                    fullWidth
                                    value={service.icon}
                                    onChange={(e) => updateService(service.id, 'icon', e.target.value)}
                                    margin="normal"
                                    disabled={editingId !== service.id}
                                    sx={{ mb: 3 }}
                                >
                                    {iconOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    label="Description"
                                    fullWidth
                                    multiline
                                    rows={5}
                                    value={service.description}
                                    onChange={(e) => updateService(service.id, 'description', e.target.value)}
                                    margin="normal"
                                    disabled={editingId !== service.id}
                                    sx={{ mb: 4 }}
                                />

                                <Box>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={<PhotoCameraIcon />}
                                    >
                                        Change Image
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, service.id)}
                                        />
                                    </Button>

                                    {service.backgroundImage && (
                                        <Box sx={{ mt: 3, maxWidth: 600, borderRadius: 2, overflow: 'hidden' }}>
                                            <img
                                                src={service.backgroundImage}
                                                alt="Service background"
                                                style={{ width: '100%', display: 'block', borderRadius: 8 }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Paper>
    );
}