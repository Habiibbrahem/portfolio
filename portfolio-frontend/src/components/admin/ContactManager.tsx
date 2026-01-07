// src/components/admin/ContactManager.tsx
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    Grid,
    CircularProgress,
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { uploadImage } from '../../api/upload';
import api from '../../api/client';

interface ContactData {
    backgroundImage: string;
    homeImage: string;
    addressLine1: string;
    addressLine2: string;
    phone1: string;
    phone2: string;
    phone3: string;
    email: string;
    hours: string;
}

interface ContactSection {
    _id?: string;
    section: 'contact';
    data: ContactData;
    published: boolean;
}

const getContact = async (): Promise<ContactSection> => {
    try {
        const { data } = await api.get('/cms/contact');
        return data;
    } catch (err: any) {
        if (err.response?.status === 404) {
            const { data } = await api.post('/cms', {
                section: 'contact',
                data: {
                    backgroundImage: '',
                    homeImage: '',
                    addressLine1: 'RUE IBN MAJ Z.I. SAINT GOBAIN',
                    addressLine2: 'Megrine BEN AROUS 2014 Tunisie',
                    phone1: '+ 216 71 428 807',
                    phone2: '+ 216 71 428 851',
                    phone3: '+ 216 71 296 152',
                    email: 'info.snc@snrc.com.tn',
                    hours: 'Lundi - Samedi : 9:00 - 18:00',
                },
                published: true,
            });
            return data;
        }
        throw err;
    }
};

const updateContact = async (updatedData: ContactData) => {
    const { data } = await api.patch('/cms/contact', { data: updatedData });
    return data;
};

export default function ContactManager() {
    const queryClient = useQueryClient();
    const [contactData, setContactData] = useState<ContactData>({
        backgroundImage: '',
        homeImage: '',
        addressLine1: '',
        addressLine2: '',
        phone1: '',
        phone2: '',
        phone3: '',
        email: '',
        hours: '',
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const { data: contactSection, isLoading } = useQuery<ContactSection>({
        queryKey: ['contact'],
        queryFn: getContact,
    });

    const mutation = useMutation({
        mutationFn: updateContact,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contact'] });
            setSuccess('Contact information updated successfully!');
            setTimeout(() => setSuccess(''), 4000);
        },
        onError: () => {
            setError('Failed to save. Please try again.');
            setTimeout(() => setError(''), 5000);
        },
    });

    useEffect(() => {
        if (contactSection?.data) {
            setContactData(contactSection.data);
        }
    }, [contactSection]);

    const handleChange = (field: keyof ContactData, value: string) => {
        setContactData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'backgroundImage' | 'homeImage') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSuccess('Uploading image...');
        try {
            const url = await uploadImage(file);
            setContactData((prev) => ({ ...prev, [field]: url }));
            setSuccess('Image uploaded!');
        } catch (err) {
            setError('Image upload failed');
        }
    };

    const handleSave = () => {
        mutation.mutate(contactData);
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
            <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
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
                        Contact Page Manager
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

                {/* Contact Page Background */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h6" sx={{ mb: 3, color: '#94A3B8', fontWeight: 600 }}>
                        Contact Page Background
                    </Typography>
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
                        {contactData.backgroundImage ? 'Change Background' : 'Upload Background'}
                        <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'backgroundImage')} />
                    </Button>

                    {contactData.backgroundImage && (
                        <Box sx={{ mt: 4, maxWidth: 900, borderRadius: 3, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}>
                            <img
                                src={contactData.backgroundImage}
                                alt="Contact background"
                                style={{ width: '100%', display: 'block' }}
                            />
                        </Box>
                    )}
                </Box>

                {/* Homepage "Get In Touch" Image */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h6" sx={{ mb: 3, color: '#94A3B8', fontWeight: 600 }}>
                        Homepage "Get In Touch" Image (Right Side)
                    </Typography>
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
                        {contactData.homeImage ? 'Change Image' : 'Upload Image'}
                        <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'homeImage')} />
                    </Button>

                    {contactData.homeImage && (
                        <Box sx={{ mt: 4, maxWidth: 900, borderRadius: 3, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}>
                            <img
                                src={contactData.homeImage}
                                alt="Homepage contact"
                                style={{ width: '100%', display: 'block' }}
                            />
                        </Box>
                    )}
                </Box>

                {/* Contact Info Fields */}
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Address Line 1"
                            fullWidth
                            value={contactData.addressLine1}
                            onChange={(e) => handleChange('addressLine1', e.target.value)}
                            margin="normal"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#1E293B',
                                    color: 'white',
                                    borderRadius: 2,
                                    '& fieldset': { borderColor: '#334155' },
                                    '&:hover fieldset': { borderColor: '#EAB308' },
                                    '&.Mui-focused fieldset': { borderColor: '#EAB308', borderWidth: 2 },
                                },
                                '& .MuiInputLabel-root': { color: '#94A3B8', fontWeight: 600, '&.Mui-focused': { color: '#EAB308' } },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Address Line 2"
                            fullWidth
                            value={contactData.addressLine2}
                            onChange={(e) => handleChange('addressLine2', e.target.value)}
                            margin="normal"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#1E293B',
                                    color: 'white',
                                    borderRadius: 2,
                                    '& fieldset': { borderColor: '#334155' },
                                    '&:hover fieldset': { borderColor: '#EAB308' },
                                    '&.Mui-focused fieldset': { borderColor: '#EAB308', borderWidth: 2 },
                                },
                                '& .MuiInputLabel-root': { color: '#94A3B8', fontWeight: 600, '&.Mui-focused': { color: '#EAB308' } },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Phone 1"
                            fullWidth
                            value={contactData.phone1}
                            onChange={(e) => handleChange('phone1', e.target.value)}
                            margin="normal"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#1E293B',
                                    color: 'white',
                                    borderRadius: 2,
                                    '& fieldset': { borderColor: '#334155' },
                                    '&:hover fieldset': { borderColor: '#EAB308' },
                                    '&.Mui-focused fieldset': { borderColor: '#EAB308', borderWidth: 2 },
                                },
                                '& .MuiInputLabel-root': { color: '#94A3B8', fontWeight: 600, '&.Mui-focused': { color: '#EAB308' } },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Phone 2"
                            fullWidth
                            value={contactData.phone2}
                            onChange={(e) => handleChange('phone2', e.target.value)}
                            margin="normal"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#1E293B',
                                    color: 'white',
                                    borderRadius: 2,
                                    '& fieldset': { borderColor: '#334155' },
                                    '&:hover fieldset': { borderColor: '#EAB308' },
                                    '&.Mui-focused fieldset': { borderColor: '#EAB308', borderWidth: 2 },
                                },
                                '& .MuiInputLabel-root': { color: '#94A3B8', fontWeight: 600, '&.Mui-focused': { color: '#EAB308' } },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Phone 3"
                            fullWidth
                            value={contactData.phone3}
                            onChange={(e) => handleChange('phone3', e.target.value)}
                            margin="normal"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#1E293B',
                                    color: 'white',
                                    borderRadius: 2,
                                    '& fieldset': { borderColor: '#334155' },
                                    '&:hover fieldset': { borderColor: '#EAB308' },
                                    '&.Mui-focused fieldset': { borderColor: '#EAB308', borderWidth: 2 },
                                },
                                '& .MuiInputLabel-root': { color: '#94A3B8', fontWeight: 600, '&.Mui-focused': { color: '#EAB308' } },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Email"
                            fullWidth
                            type="email"
                            value={contactData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            margin="normal"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#1E293B',
                                    color: 'white',
                                    borderRadius: 2,
                                    '& fieldset': { borderColor: '#334155' },
                                    '&:hover fieldset': { borderColor: '#EAB308' },
                                    '&.Mui-focused fieldset': { borderColor: '#EAB308', borderWidth: 2 },
                                },
                                '& .MuiInputLabel-root': { color: '#94A3B8', fontWeight: 600, '&.Mui-focused': { color: '#EAB308' } },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Working Hours"
                            fullWidth
                            value={contactData.hours}
                            onChange={(e) => handleChange('hours', e.target.value)}
                            margin="normal"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#1E293B',
                                    color: 'white',
                                    borderRadius: 2,
                                    '& fieldset': { borderColor: '#334155' },
                                    '&:hover fieldset': { borderColor: '#EAB308' },
                                    '&.Mui-focused fieldset': { borderColor: '#EAB308', borderWidth: 2 },
                                },
                                '& .MuiInputLabel-root': { color: '#94A3B8', fontWeight: 600, '&.Mui-focused': { color: '#EAB308' } },
                            }}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 8, textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSave}
                        disabled={mutation.isPending}
                        sx={{
                            px: 10,
                            py: 2,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #EAB308 0%, #F59E0B 100%)',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            boxShadow: '0 8px 16px 0 rgba(234, 179, 8, 0.25)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                boxShadow: '0 12px 24px 0 rgba(234, 179, 8, 0.35)',
                                transform: 'translateY(-2px)',
                            },
                            '&:disabled': {
                                background: '#334155',
                                color: '#64748B',
                                boxShadow: 'none',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {mutation.isPending ? 'Saving...' : 'Save All Changes'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}