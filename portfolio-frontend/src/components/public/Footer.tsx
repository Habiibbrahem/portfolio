import { useQuery } from '@tanstack/react-query';
import { Box, Container, Typography, Divider, IconButton, Link } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';

import api from '../../api/client';

const fetchSocial = async () => {
    try {
        const { data } = await api.get('/cms/social');
        return data.data || {};
    } catch (err: any) {
        if (err.response?.status === 404) return {};
        console.warn('Could not load social links');
        return {};
    }
};

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const { data: socialLinks = {} } = useQuery({
        queryKey: ['social'],
        queryFn: fetchSocial,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const platforms = [
        { key: 'linkedin', icon: <LinkedInIcon />, url: socialLinks.linkedin },
        { key: 'instagram', icon: <InstagramIcon />, url: socialLinks.instagram },
        { key: 'facebook', icon: <FacebookIcon />, url: socialLinks.facebook },
        { key: 'x', icon: <XIcon />, url: socialLinks.x },
    ];

    const activeLinks = platforms.filter(p => p.url && p.url.trim() !== '');

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'primary.main',
                color: 'white',
                py: 6,
                mt: 'auto'
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center' }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            mb: 2
                        }}
                    >
                        CONSTRUCT
                    </Typography>

                    <Divider
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            mb: 4,
                            mx: 'auto',
                            width: '100px'
                        }}
                    />

                    {/* Social Icons */}
                    {activeLinks.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            {activeLinks.map(({ key, icon, url }) => (
                                <IconButton
                                    key={key}
                                    component={Link}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        color: 'white',
                                        mx: 1,
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', transform: 'scale(1.1)' },
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {icon}
                                </IconButton>
                            ))}
                        </Box>
                    )}

                    <Typography
                        variant="body2"
                        sx={{
                            opacity: 0.8
                        }}
                    >
                        © {currentYear} Construct Building Solutions. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}