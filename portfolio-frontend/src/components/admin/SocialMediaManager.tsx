import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    Paper,
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
            // Create default if not exists
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
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress size={60} />
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
        <Paper elevation={4} sx={{ p: { xs: 4, md: 6 }, maxWidth: 900, mx: 'auto', borderRadius: 4 }}>
            <Typography variant="h4" fontWeight="bold" color="primary" mb={5}>
                Social Media Links Manager
            </Typography>

            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Typography variant="body1" color="text.secondary" mb={4}>
                Add your full profile URLs. Leave blank to hide the icon in footer.
            </Typography>

            {platforms.map(({ key, label, icon, color }) => (
                <Box key={key} sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <IconButton sx={{ bgcolor: color, color: 'white', '&:hover': { bgcolor: color } }}>
                        {icon}
                    </IconButton>
                    <TextField
                        label={label}
                        placeholder={`https://${key === 'x' ? 'x.com' : key + '.com'}/your-profile`}
                        fullWidth
                        value={links[key as keyof typeof links]}
                        onChange={(e) => handleChange(key as keyof typeof defaultSocialData, e.target.value)}
                    />
                </Box>
            ))}

            <Button
                variant="contained"
                size="large"
                onClick={handleSave}
                disabled={mutation.isPending}
                sx={{ mt: 4, px: 8, py: 1.5, borderRadius: 3 }}
            >
                {mutation.isPending ? 'Saving…' : 'Save Social Links'}
            </Button>
        </Paper>
    );
}