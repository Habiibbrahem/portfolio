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
    IconButton,
    Grid,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    PhotoCamera as PhotoCameraIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import {
    Construction,
    Build,
    DesignServices,
    Engineering,
    HomeRepairService,
    Architecture,
    Handyman,
    Roofing,
    Plumbing,
    ElectricalServices,
    Landscape,
    Foundation,
    Apartment,
    Warehouse,
    Fence,
    Garage,
} from '@mui/icons-material';
import { uploadImage } from '../../api/upload';
import api from '../../api/client';

interface ServiceItem {
    id: string;
    title: string;
    description: string;
    backgroundImage: string;
    icon: string;
}

interface ServicesSection {
    _id?: string;
    section: 'services';
    data: {
        services: ServiceItem[];
    };
    published: boolean;
}

const iconMap: { [key: string]: React.ReactElement } = {
    Construction: <Construction fontSize="large" />,
    Build: <Build fontSize="large" />,
    DesignServices: <DesignServices fontSize="large" />,
    Engineering: <Engineering fontSize="large" />,
    HomeRepairService: <HomeRepairService fontSize="large" />,
    Architecture: <Architecture fontSize="large" />,
    Handyman: <Handyman fontSize="large" />,
    Roofing: <Roofing fontSize="large" />,
    Plumbing: <Plumbing fontSize="large" />,
    ElectricalServices: <ElectricalServices fontSize="large" />,
    Landscape: <Landscape fontSize="large" />,
    Foundation: <Foundation fontSize="large" />,
    Apartment: <Apartment fontSize="large" />,
    Warehouse: <Warehouse fontSize="large" />,
    Fence: <Fence fontSize="large" />,
    Garage: <Garage fontSize="large" />,
};

const iconOptions = Object.keys(iconMap);

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
            const services = servicesSection.data.services.map((s: any) => ({
                ...s,
                icon: s.icon && iconOptions.includes(s.icon) ? s.icon : 'Construction',
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

        api.post('/activity/log', {
            text: `Added new service: ${draftService.title}`,
            type: 'service_add',
        }).catch(() => { });

        setDraftService(null);
    };

    const updateService = (id: string, field: keyof ServiceItem, value: string) => {
        const newList = savedServices.map((s) =>
            s.id === id ? { ...s, [field]: value } : s
        );
        setSavedServices(newList);
        mutation.mutate({ services: newList });

        if (field === 'title') {
            api.post('/activity/log', {
                text: `Updated service: ${value}`,
                type: 'service_update',
            }).catch(() => { });
        }
    };

    const removeService = (id: string) => {
        const deletedService = savedServices.find(s => s.id === id);
        const newList = savedServices.filter((s) => s.id !== id);
        setSavedServices(newList);
        mutation.mutate({ services: newList });

        api.post('/activity/log', {
            text: `Deleted service: ${deletedService?.title || 'Untitled'}`,
            type: 'service_delete',
        }).catch(() => { });

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

    const selectIcon = (iconName: string, isDraft: boolean = false) => {
        if (isDraft && draftService) {
            setDraftService({ ...draftService, icon: iconName });
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} sx={{ color: '#EAB308' }} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#0F172A',
                color: 'white',
                p: { xs: 3, md: 6 },
            }}
        >
            <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
                {/* Title with gold accent line */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
                    <Box
                        sx={{
                            width: 4,
                            height: 40,
                            background: 'linear-gradient(180deg, #EAB308 0%, #F59E0B 100%)',
                            borderRadius: 2,
                            mr: 3
                        }}
                    />
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{
                            color: 'white',
                            letterSpacing: '-0.5px'
                        }}
                    >
                        Services Manager
                    </Typography>
                </Box>

                {success && (
                    <Alert
                        severity="success"
                        sx={{
                            mb: 4,
                            bgcolor: 'rgba(16, 185, 129, 0.1)',
                            color: '#34D399',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            '& .MuiAlert-icon': { color: '#34D399' }
                        }}
                    >
                        {success}
                    </Alert>
                )}
                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 4,
                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                            color: '#F87171',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            '& .MuiAlert-icon': { color: '#F87171' }
                        }}
                    >
                        {error}
                    </Alert>
                )}

                {mutation.isPending && (
                    <Alert
                        severity="info"
                        sx={{
                            mb: 4,
                            bgcolor: 'rgba(59, 130, 246, 0.1)',
                            color: '#93C5FD',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                        }}
                    >
                        Saving...
                    </Alert>
                )}

                {/* Add New Service Button */}
                {!draftService && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={startNewService}
                        sx={{
                            mb: 6,
                            background: 'linear-gradient(135deg, #EAB308 0%, #F59E0B 100%)',
                            color: 'white',
                            fontWeight: 600,
                            px: 6,
                            py: 1.5,
                            borderRadius: 2,
                            boxShadow: '0 4px 14px 0 rgba(234, 179, 8, 0.2)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
                                boxShadow: '0 6px 20px 0 rgba(234, 179, 8, 0.3)',
                            },
                        }}
                    >
                        Add New Service
                    </Button>
                )}

                {/* New Service Form */}
                {draftService && (
                    <Box
                        sx={{
                            p: 5,
                            mb: 6,
                            borderRadius: 3,
                            bgcolor: '#1E293B',
                            border: '1px solid #334155',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        }}
                    >
                        <Typography variant="h6" sx={{ color: '#EAB308', mb: 4, fontWeight: 600 }}>
                            Creating New Service
                        </Typography>

                        <TextField
                            label="Service Title *"
                            fullWidth
                            value={draftService.title}
                            onChange={(e) => setDraftService({ ...draftService, title: e.target.value })}
                            margin="normal"
                            sx={{
                                mb: 4,
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#0F172A',
                                    color: 'white',
                                    borderRadius: 2,
                                    '& fieldset': { borderColor: '#334155' },
                                    '&:hover fieldset': { borderColor: '#EAB308' },
                                    '&.Mui-focused fieldset': { borderColor: '#EAB308', borderWidth: 2 },
                                },
                                '& .MuiInputLabel-root': { color: '#94A3B8', fontWeight: 600, '&.Mui-focused': { color: '#EAB308' } },
                            }}
                        />

                        <Typography variant="subtitle1" sx={{ mb: 3, color: '#94A3B8', fontWeight: 600 }}>
                            Choose Icon
                        </Typography>
                        <Grid container spacing={3} sx={{ mb: 5 }}>
                            {iconOptions.map((iconName) => (
                                <Grid item xs={4} sm={3} md={2} key={iconName}>
                                    <Box
                                        onClick={() => selectIcon(iconName, true)}
                                        sx={{
                                            height: 120,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 3,
                                            border: draftService.icon === iconName ? '3px solid #EAB308' : '2px dashed #334155',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            bgcolor: draftService.icon === iconName ? 'rgba(234, 179, 8, 0.1)' : 'transparent',
                                            '&:hover': {
                                                bgcolor: 'rgba(234, 179, 8, 0.15)',
                                                borderColor: '#EAB308',
                                                transform: 'translateY(-4px)',
                                            },
                                        }}
                                    >
                                        <Box sx={{ fontSize: 56, color: draftService.icon === iconName ? '#EAB308' : '#94A3B8', mb: 1 }}>
                                            {iconMap[iconName]}
                                        </Box>
                                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                            {iconName}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={6}
                            value={draftService.description}
                            onChange={(e) => setDraftService({ ...draftService, description: e.target.value })}
                            margin="normal"
                            sx={{
                                mb: 5,
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#0F172A',
                                    color: 'white',
                                    borderRadius: 2,
                                    '& fieldset': { borderColor: '#334155' },
                                    '&:hover fieldset': { borderColor: '#EAB308' },
                                    '&.Mui-focused fieldset': { borderColor: '#EAB308', borderWidth: 2 },
                                },
                                '& .MuiInputLabel-root': { color: '#94A3B8', fontWeight: 600, '&.Mui-focused': { color: '#EAB308' } },
                            }}
                        />

                        <Box sx={{ mb: 5 }}>
                            <Button
                                variant="contained"
                                component="label"
                                startIcon={<PhotoCameraIcon />}
                                sx={{
                                    background: 'linear-gradient(135deg, #EAB308 0%, #F59E0B 100%)',
                                    color: 'white',
                                    fontWeight: 600,
                                    px: 5,
                                    py: 1.5,
                                    borderRadius: 2,
                                    boxShadow: '0 4px 14px 0 rgba(234, 179, 8, 0.2)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
                                        boxShadow: '0 6px 20px 0 rgba(234, 179, 8, 0.3)',
                                    },
                                }}
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
                                <Box sx={{ mt: 4, maxWidth: 800, borderRadius: 3, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                                    <img
                                        src={draftService.backgroundImage}
                                        alt="Preview"
                                        style={{ width: '100%', display: 'block' }}
                                    />
                                </Box>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 3 }}>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                onClick={createService}
                                disabled={!draftService.title.trim()}
                                sx={{
                                    background: 'linear-gradient(135deg, #EAB308 0%, #F59E0B 100%)',
                                    color: 'white',
                                    fontWeight: 700,
                                    px: 6,
                                    py: 1.8,
                                    borderRadius: 2,
                                    boxShadow: '0 8px 16px 0 rgba(234, 179, 8, 0.25)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                        boxShadow: '0 12px 24px 0 rgba(234, 179, 8, 0.35)',
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                Create Service
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<CancelIcon />}
                                onClick={cancelNewService}
                                sx={{
                                    borderColor: '#334155',
                                    color: '#94A3B8',
                                    '&:hover': { borderColor: '#EAB308', color: '#EAB308' },
                                }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* Existing Services */}
                <Typography
                    variant="h5"
                    sx={{
                        mb: 4,
                        color: '#94A3B8',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}
                >
                    Existing Services ({savedServices.length})
                </Typography>

                {savedServices.length === 0 ? (
                    <Typography sx={{ color: '#64748B', textAlign: 'center', py: 10, fontSize: '1.2rem' }}>
                        No services yet. Click "Add New Service" to create one.
                    </Typography>
                ) : (
                    <Grid container spacing={5}>
                        {savedServices.map((service) => (
                            <Grid item xs={12} key={service.id}>
                                <Box
                                    sx={{
                                        p: 5,
                                        borderRadius: 3,
                                        bgcolor: '#1E293B',
                                        border: '1px solid #334155',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: '#EAB308',
                                            boxShadow: '0 12px 40px rgba(234,179,8,0.2)',
                                        },
                                        position: 'relative',
                                    }}
                                >
                                    <Box sx={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 2 }}>
                                        <IconButton
                                            onClick={() => setEditingId(service.id)}
                                            sx={{
                                                color: '#94A3B8',
                                                bgcolor: 'rgba(148,163,184,0.1)',
                                                '&:hover': { color: '#EAB308', bgcolor: 'rgba(234,179,8,0.2)' },
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => removeService(service.id)}
                                            sx={{
                                                color: '#F87171',
                                                bgcolor: 'rgba(239,68,68,0.1)',
                                                '&:hover': { color: '#EF4444', bgcolor: 'rgba(239,68,68,0.2)' },
                                            }}
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
                                        sx={{
                                            mb: 4,
                                            '& .MuiOutlinedInput-root': {
                                                bgcolor: '#0F172A',
                                                color: 'white',
                                                borderRadius: 2,
                                                '& fieldset': { borderColor: '#334155' },
                                                '&:hover fieldset': { borderColor: '#EAB308' },
                                                '&.Mui-focused fieldset': { borderColor: '#EAB308', borderWidth: 2 },
                                            },
                                            '& .MuiInputLabel-root': { color: '#94A3B8', fontWeight: 600, '&.Mui-focused': { color: '#EAB308' } },
                                        }}
                                    />

                                    <Typography variant="subtitle1" sx={{ mb: 3, color: '#94A3B8', fontWeight: 600 }}>
                                        Choose Icon
                                    </Typography>
                                    <Grid container spacing={3} sx={{ mb: 5 }}>
                                        {iconOptions.map((iconName) => (
                                            <Grid item xs={4} sm={3} md={2} key={iconName}>
                                                <Box
                                                    onClick={() => selectIcon(iconName)}
                                                    sx={{
                                                        height: 120,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderRadius: 3,
                                                        border: service.icon === iconName ? '3px solid #EAB308' : '2px dashed #334155',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease',
                                                        bgcolor: service.icon === iconName ? 'rgba(234, 179, 8, 0.1)' : 'transparent',
                                                        '&:hover': {
                                                            bgcolor: 'rgba(234, 179, 8, 0.15)',
                                                            borderColor: '#EAB308',
                                                            transform: 'translateY(-4px)',
                                                        },
                                                    }}
                                                >
                                                    <Box sx={{ fontSize: 56, color: service.icon === iconName ? '#EAB308' : '#94A3B8', mb: 1 }}>
                                                        {iconMap[iconName]}
                                                    </Box>
                                                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                                        {iconName}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    <TextField
                                        label="Description"
                                        fullWidth
                                        multiline
                                        rows={6}
                                        value={service.description}
                                        onChange={(e) => updateService(service.id, 'description', e.target.value)}
                                        margin="normal"
                                        sx={{
                                            mb: 5,
                                            '& .MuiOutlinedInput-root': {
                                                bgcolor: '#0F172A',
                                                color: 'white',
                                                borderRadius: 2,
                                                '& fieldset': { borderColor: '#334155' },
                                                '&:hover fieldset': { borderColor: '#EAB308' },
                                                '&.Mui-focused fieldset': { borderColor: '#EAB308', borderWidth: 2 },
                                            },
                                            '& .MuiInputLabel-root': { color: '#94A3B8', fontWeight: 600, '&.Mui-focused': { color: '#EAB308' } },
                                        }}
                                    />

                                    <Box sx={{ mb: 4 }}>
                                        <Button
                                            variant="contained"
                                            component="label"
                                            startIcon={<PhotoCameraIcon />}
                                            sx={{
                                                background: 'linear-gradient(135deg, #EAB308 0%, #F59E0B 100%)',
                                                color: 'white',
                                                fontWeight: 600,
                                                px: 5,
                                                py: 1.5,
                                                borderRadius: 2,
                                                boxShadow: '0 4px 14px 0 rgba(234, 179, 8, 0.2)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
                                                    boxShadow: '0 6px 20px 0 rgba(234, 179, 8, 0.3)',
                                                },
                                            }}
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
                                            <Box sx={{ mt: 4, maxWidth: 900, borderRadius: 3, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}>
                                                <img
                                                    src={service.backgroundImage}
                                                    alt="Service background"
                                                    style={{ width: '100%', display: 'block' }}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Box>
    );
}