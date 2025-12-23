// src/pages/public/Services.tsx
import { useQuery } from '@tanstack/react-query';
import { Box, Container, Typography, LinearProgress } from '@mui/material';
import PublicNavbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import api from '../../api/client';

interface ServiceItem {
    title: string;
    description: string;
    backgroundImage: string;
}

const getServices = async () => {
    const { data } = await api.get('/cms/services');
    return data;
};

export default function Services() {
    const { data: section, isLoading } = useQuery({
        queryKey: ['services'],
        queryFn: getServices,
    });

    const services: ServiceItem[] = section?.published !== false ? section?.data?.services || [] : [];

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            <PublicNavbar />

            <Box sx={{ flex: 1, py: { xs: 8, md: 12 } }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        component="h1"
                        align="center"
                        fontWeight={700}
                        color="primary.main"
                        gutterBottom
                        sx={{ mb: { xs: 10, md: 14 } }}
                    >
                        Our Services
                    </Typography>

                    {isLoading && <LinearProgress sx={{ mb: 8 }} />}

                    {services.length === 0 && !isLoading && (
                        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 10 }}>
                            No services added yet.
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 12, md: 16 } }}>
                        {services.map((service, index) => {
                            const isOdd = index % 2 === 0; // 1st, 3rd → left

                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        position: 'relative',
                                        height: { xs: 500, md: 650 },
                                        borderRadius: 5,
                                        overflow: 'hidden',
                                        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                                        backgroundImage: service.backgroundImage ? `url(${service.backgroundImage})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)',
                                            zIndex: 1,
                                        },
                                    }}
                                >
                                    <Container
                                        sx={{
                                            position: 'relative',
                                            zIndex: 2,
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                maxWidth: { xs: '100%', md: '70%' },
                                                color: 'white',
                                                textAlign: isOdd ? 'left' : 'right',
                                                ml: isOdd ? 0 : 'auto',
                                                mr: isOdd ? 'auto' : 0,
                                                p: { xs: 4, md: 6 },
                                            }}
                                        >
                                            <Typography
                                                variant="h2"
                                                fontWeight={900}
                                                gutterBottom
                                                sx={{
                                                    fontSize: { xs: '2.8rem', md: '4.5rem' },
                                                    lineHeight: 1.1,
                                                    textShadow: '4px 4px 12px rgba(0,0,0,0.9)',
                                                    mb: 4,
                                                }}
                                            >
                                                {service.title}
                                            </Typography>

                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                                                    lineHeight: 1.8,
                                                    textShadow: '2px 2px 8px rgba(0,0,0,0.9)',
                                                    opacity: 0.95,
                                                }}
                                            >
                                                {service.description}
                                            </Typography>
                                        </Box>
                                    </Container>

                                    {!service.backgroundImage && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                bgcolor: 'grey.400',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                zIndex: 0,
                                            }}
                                        >
                                            <Typography variant="h5" color="text.secondary">
                                                No image uploaded
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            );
                        })}
                    </Box>
                </Container>
            </Box>

            <Footer />
        </Box>
    );
}