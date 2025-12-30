import { Box, Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';

interface HeroData {
    title?: string;
    subtitle?: string;
    backgroundImages?: string[];
}

export default function HeroSection({ data }: { data: HeroData }) {
    const image = data.backgroundImages?.[0] || '';

    return (
        <Box
            sx={{
                height: '100vh',
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(15,23,42,0.7), rgba(15,23,42,0.9))',
                },
            }}
        >
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ maxWidth: '800px', color: 'white' }}>
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '3.5rem', md: '5rem' },
                            fontWeight: 900,
                            mb: 3,
                        }}
                    >
                        {data.title || 'Building Your Future'}
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { xs: '1.3rem', md: '1.8rem' },
                            mb: 6,
                            opacity: 0.9,
                        }}
                    >
                        {data.subtitle || 'Reliable & Professional Construction Services'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            component={Link}
                            to="/services"
                            sx={{ px: 5, py: 2, fontSize: '1.2rem' }}
                        >
                            View Projects
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            component={Link}
                            to="/contact"
                            sx={{
                                px: 5,
                                py: 2,
                                fontSize: '1.2rem',
                                borderColor: 'white',
                                color: 'white',
                                '&:hover': { borderColor: 'secondary.main', bgcolor: 'secondary.main', color: 'black' },
                            }}
                        >
                            Contact Us
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}