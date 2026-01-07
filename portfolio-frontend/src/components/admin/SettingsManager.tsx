// src/components/admin/SettingsManager.tsx
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    Grid,
    Divider,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { uploadImage } from '../../api/upload';
import api from '../../api/client';

interface ContactData {
    backgroundImage?: string;
    homeImage?: string;
    loginBackgroundImage?: string;
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
            <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
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
                        Settings
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

                <Grid container spacing={8}>
                    {/* Login Background */}
                    <Grid item xs={12} lg={6}>
                        <Typography variant="h6" sx={{ mb: 3, color: '#94A3B8', fontWeight: 600 }}>
                            Login Page Background
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#CBD5E1', mb: 4 }}>
                            Upload a high-quality construction image for the admin login screen.
                        </Typography>

                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<PhotoCameraIcon />}
                            disabled={uploadMutation.isPending}
                            sx={{
                                mb: 5,
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
                            {uploadMutation.isPending ? 'Uploading...' : 'Upload New Background'}
                            <input type="file" hidden accept="image/*" onChange={handleUpload} />
                        </Button>

                        {loginBg && (
                            <Box sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}>
                                <img
                                    src={loginBg}
                                    alt="Current login background"
                                    style={{ width: '100%', display: 'block' }}
                                />
                            </Box>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 8, borderColor: '#334155' }} />
                    </Grid>

                    {/* Change Password */}
                    <Grid item xs={12} lg={6}>
                        <Typography variant="h6" sx={{ mb: 3, color: '#94A3B8', fontWeight: 600 }}>
                            Change Password
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#CBD5E1', mb: 4 }}>
                            Update your admin account password.
                        </Typography>

                        <Box component="form" onSubmit={handlePasswordChange} sx={{ maxWidth: 500 }}>
                            <TextField
                                label="Current Password"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
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
                            <TextField
                                label="New Password"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                helperText="Minimum 6 characters"
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
                                    '& .MuiFormHelperText-root': { color: '#64748B' },
                                }}
                            />
                            <TextField
                                label="Confirm New Password"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
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

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={passwordMutation.isPending}
                                sx={{
                                    mt: 5,
                                    px: 8,
                                    py: 2,
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, #EAB308 0%, #F59E0B 100%)',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '1rem',
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
                                {passwordMutation.isPending ? 'Updating...' : 'Update Password'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}