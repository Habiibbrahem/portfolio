// src/components/admin/ContactManager.tsx
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    Paper,
    Grid,
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { uploadImage } from '../../api/upload';
import api from '../../api/client';

interface ContactData {
    backgroundImage: string;
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSuccess('Uploading background image...');
        try {
            const url = await uploadImage(file);
            setContactData((prev) => ({ ...prev, backgroundImage: url }));
            setSuccess('Background image uploaded!');
        } catch (err) {
            setError('Image upload failed');
        }
    };

    const handleSave = () => {
        mutation.mutate(contactData);
    };

    if (isLoading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Paper elevation={4} sx={{ p: { xs: 4, md: 6 }, maxWidth: 1100, mx: 'auto', borderRadius: 4 }}>
            <Typography variant="h4" fontWeight="bold" color="primary.main" mb={5}>
                Contact Page Manager
            </Typography>

            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {/* Background Image */}
            <Box sx={{ mb: 5 }}>
                <Typography variant="h6" gutterBottom>
                    Background Image
                </Typography>
                <Button
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoCameraIcon />}
                >
                    {contactData.backgroundImage ? 'Change Background Image' : 'Upload Background Image'}
                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </Button>

                {contactData.backgroundImage && (
                    <Box sx={{ mt: 3, maxWidth: 800, borderRadius: 3, overflow: 'hidden' }}>
                        <img
                            src={contactData.backgroundImage}
                            alt="Contact background"
                            style={{ width: '100%', display: 'block', borderRadius: 12 }}
                        />
                    </Box>
                )}
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Address Line 1"
                        fullWidth
                        value={contactData.addressLine1}
                        onChange={(e) => handleChange('addressLine1', e.target.value)}
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Address Line 2"
                        fullWidth
                        value={contactData.addressLine2}
                        onChange={(e) => handleChange('addressLine2', e.target.value)}
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Phone 1"
                        fullWidth
                        value={contactData.phone1}
                        onChange={(e) => handleChange('phone1', e.target.value)}
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Phone 2"
                        fullWidth
                        value={contactData.phone2}
                        onChange={(e) => handleChange('phone2', e.target.value)}
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Phone 3"
                        fullWidth
                        value={contactData.phone3}
                        onChange={(e) => handleChange('phone3', e.target.value)}
                        margin="normal"
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
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Working Hours"
                        fullWidth
                        value={contactData.hours}
                        onChange={(e) => handleChange('hours', e.target.value)}
                        margin="normal"
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleSave}
                    disabled={mutation.isPending}
                    sx={{ px: 8, py: 1.5 }}
                >
                    {mutation.isPending ? 'Saving...' : 'Save All Changes'}
                </Button>
            </Box>
        </Paper>
    );
}