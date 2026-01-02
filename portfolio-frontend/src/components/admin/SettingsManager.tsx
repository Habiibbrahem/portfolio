// src/components/admin/SettingsManager.tsx
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    Paper,
    Grid,
    Divider,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { uploadImage } from '../../api/upload';
import api from '../../api/client';

interface ContactData {
    backgroundImage?: string;
    homeImage?: string;
    loginBackgroundImage?: string; // NEW: Dedicated login background
    addressLine1?: string;
    addressLine2?: string;
    phone1?: string;
    phone2?: string;
    phone3?: string;
    email?: string;
    hours?: string;
}

const getContact = async (): Promise<{ data: ContactData }> => {
    const { data } = await api.get('/cms/contact');
    return data;
};

const updateContact = async (updated: Partial<ContactData>) => {
    const { data } = await api.patch('/cms/contact', { data: updated });
    return data;
};

const changePassword = async (payload: { currentPassword: string; newPassword: string }) => {
    const { data } = await api.post('/auth/change-password', payload);
    return data;
};

export default function SettingsManager() {
    const queryClient = useQueryClient();
    const [loginBg, setLoginBg] = useState<string>('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const { data: contactData, isLoading } = useQuery({
        queryKey: ['contact'],
        queryFn: getContact,
    });

    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const url = await uploadImage(file);
            await updateContact({ loginBackgroundImage: url });
            return url;
        },
        onSuccess: (url) => {
            queryClient.invalidateQueries({ queryKey: ['contact'] });
            setLoginBg(url);
            setSuccess('Login background updated successfully!');
            setTimeout(() => setSuccess(''), 4000);
        },
        onError: () => setError('Upload failed'),
    });

    const passwordMutation = useMutation({
        mutationFn: changePassword,
        onSuccess: () => {
            setSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setSuccess(''), 4000);
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to change password');
        },
    });

    useEffect(() => {
        if (contactData?.data?.loginBackgroundImage) {
            setLoginBg(contactData.data.loginBackgroundImage);
        }
    }, [contactData]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError('');
        setSuccess('Uploading...');
        uploadMutation.mutate(file);
    };

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }

        passwordMutation.mutate({ currentPassword, newPassword });
    };

    if (isLoading) return <Typography>Loading settings...</Typography>;

    return (
        <Paper elevation={4} sx={{ p: { xs: 4, md: 6 }, maxWidth: 1000, mx: 'auto', borderRadius: 4 }}>
            <Typography variant="h4" fontWeight="bold" color="primary.main" mb={5}>
                Settings
            </Typography>

            {success && <Alert severity="success" sx={{ mb: 4 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

            <Grid container spacing={6}>
                {/* Login Background */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                        Login Page Background
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Upload a high-quality construction image for the admin login screen.
                    </Typography>

                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<PhotoCameraIcon />}
                        disabled={uploadMutation.isPending}
                    >
                        {uploadMutation.isPending ? 'Uploading...' : 'Upload New Background'}
                        <input type="file" hidden accept="image/*" onChange={handleUpload} />
                    </Button>

                    {loginBg && (
                        <Box sx={{ mt: 4, borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
                            <img
                                src={loginBg}
                                alt="Current login background"
                                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12 }}
                            />
                        </Box>
                    )}
                </Grid>

                <Grid item xs={12}>
                    <Divider sx={{ my: 4 }} />
                </Grid>

                {/* Change Password */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                        Change Password
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Update your admin account password.
                    </Typography>

                    <Box component="form" onSubmit={handlePasswordChange} sx={{ maxWidth: 400 }}>
                        <TextField
                            label="Current Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                        <TextField
                            label="New Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            helperText="Minimum 6 characters"
                        />
                        <TextField
                            label="Confirm New Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={passwordMutation.isPending}
                            sx={{ mt: 3, px: 6, py: 1.5 }}
                        >
                            {passwordMutation.isPending ? 'Updating...' : 'Update Password'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}