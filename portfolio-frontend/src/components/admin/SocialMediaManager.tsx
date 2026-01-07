// src/components/admin/SocialMediaManager.tsx
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
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';

import api from '../../api/client';
import type { CmsSection } from '../../types/cms';

const defaultSocialData = {
    linkedin: '',
    instagram: '',
    facebook: '',
    x: '',
};

const fetchSocial = async (): Promise<CmsSection> => {
    try {
        const { data } = await api.get('/cms/social');
        return data;
    } catch (err: any) {
        if (err.response?.status === 404) {
            const { data } = await api.post('/cms', {
                section: 'social',
                data: defaultSocialData,
                published: true,
            });
            return data;
        }
        throw err;
    }
};

const updateSocial = async (data: typeof defaultSocialData) => {
    const { data: response } = await api.patch('/cms/social', { data });
    return response;
};

export default function SocialMediaManager() {
    const queryClient = useQueryClient();

    const [links, setLinks] = useState(defaultSocialData);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const { data: social, isLoading } = useQuery<CmsSection>({
        queryKey: ['social'],
        queryFn: fetchSocial,
    });

    const mutation = useMutation({
        mutationFn: updateSocial,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['social'] });
            setSuccess('Social media links saved successfully!');
            setTimeout(() => setSuccess(''), 4000);
        },
        onError: () => {
            setError('Failed to save. Please try again.');
            setTimeout(() => setError(''), 5000);
        },
    });

    useEffect(() => {
        if (social?.data) {
            setLinks({
                linkedin: social.data.linkedin || '',
                instagram: social.data.instagram || '',
                facebook: social.data.facebook || '',
                x: social.data.x || '',
            });
        }
    }, [social]);

    const handleChange = (platform: keyof typeof defaultSocialData, value: string) => {
        setLinks(prev => ({ ...prev, [platform]: value.trim() }));
    };

    const handleSave = () => {
        mutation.mutate(links);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} sx={{ color: '#EAB308' }} />
            </Box>
        );
    }

    const platforms = [
        { key: 'linkedin', label: 'LinkedIn', icon: <LinkedInIcon />, color: '#0077b5' },
        { key: 'instagram', label: 'Instagram', icon: <InstagramIcon />, color: '#e4405f' },
        { key: 'facebook', label: 'Facebook', icon: <FacebookIcon />, color: '#1877f2' },
        { key: 'x', label: 'X (Twitter)', icon: <XIcon />, color: '#000000' },
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#0F172A',
                color: 'white',
                p: { xs: 3, md: 6 },
            }}
        >
            <Box sx={{ maxWidth: 900, mx: 'auto' }}>
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
                        Social Media Links Manager
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

                <Typography variant="body1" sx={{ color: '#94A3B8', mb: 5 }}>
                    Add your full profile URLs. Leave blank to hide the icon in footer.
                </Typography>

                {platforms.map(({ key, label, icon, color }) => (
                    <Box key={key} sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <IconButton
                            sx={{
                                bgcolor: color,
                                color: 'white',
                                width: 56,
                                height: 56,
                                '&:hover': { bgcolor: color, opacity: 0.9 },
                            }}
                        >
                            {icon}
                        </IconButton>
                        <TextField
                            label={label}
                            placeholder={`https://${key === 'x' ? 'x.com' : key + '.com'}/your-profile`}
                            fullWidth
                            value={links[key as keyof typeof links]}
                            onChange={(e) => handleChange(key as keyof typeof defaultSocialData, e.target.value)}
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
                    </Box>
                ))}

                <Button
                    variant="contained"
                    size="large"
                    onClick={handleSave}
                    disabled={mutation.isPending}
                    sx={{
                        mt: 4,
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
                    {mutation.isPending ? 'Saving…' : 'Save Social Links'}
                </Button>
            </Box>
        </Box>
    );
}