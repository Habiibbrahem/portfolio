// src/pages/public/Services.tsx
import { useQuery } from '@tanstack/react-query';
import { Box, Container, Typography, LinearProgress, Button } from '@mui/material';
import PublicNavbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import api from '../../api/client';
import { useState } from 'react';

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

    // State to track which services are expanded
    const [expanded, setExpanded] = useState<Set<number>>(new Set());

    const toggleExpand = (index: number) => {
        setExpanded(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

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
                            const isOdd = index % 2 === 0;
                            const isExpanded = expanded.has(index);
                            const shouldTruncate = service.description.split('\n').length > 9 || service.description.length > 800; // rough check

                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                        gap: { xs: 6, md: 10 },
                                        alignItems: 'center',
                                    }}
                                >
                                    {/* Text Section - Scroll Animation */}
                                    <Box
                                        sx={{
                                            order: { xs: 2, md: isOdd ? 1 : 2 },
                                            textAlign: { xs: 'center', md: 'left' },
                                            px: { xs: 2, md: 0 },
                                            opacity: 0,
                                            animation: 'fadeUp 0.9s ease-out forwards',
                                            animationDelay: '0.2s',
                                            '@keyframes fadeUp': {
                                                from: { opacity: 0, transform: 'translateY(40px)' },
                                                to: { opacity: 1, transform: 'translateY(0)' },
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="h2"
                                            fontWeight={900}
                                            color="text.primary"
                                            gutterBottom
                                            sx={{
                                                fontSize: { xs: '2.8rem', md: '4rem' },
                                                lineHeight: 1.1,
                                            }}
                                        >
                                            {service.title}
                                        </Typography>

                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                            sx={{
                                                fontSize: { xs: '1.1rem', md: '1.25rem' },
                                                lineHeight: 1.8,
                                                mt: 3,
                                                mb: 2,
                                                maxWidth: '600px',
                                                mx: { xs: 'auto', md: '0' },
                                                display: '-webkit-box',
                                                WebkitLineClamp: shouldTruncate && !isExpanded ? 9 : 'unset',
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: isExpanded ? 'pre-wrap' : 'normal',
                                                transition: 'all 0.4s ease',
                                            }}
                                        >
                                            {service.description}
                                        </Typography>

                                        {shouldTruncate && (
                                            <Button
                                                onClick={() => toggleExpand(index)}
                                                sx={{
                                                    color: 'primary.main',
                                                    fontWeight: 600,
                                                    textTransform: 'none',
                                                    mt: 1,
                                                    '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                                                }}
                                            >
                                                {isExpanded ? 'Read less' : 'Read more...'}
                                            </Button>
                                        )}

                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 4,
                                                bgcolor: 'primary.main',
                                                mx: { xs: 'auto', md: '0' },
                                                mt: 4,
                                            }}
                                        />
                                    </Box>

                                    {/* Image Section - Scroll + Hover Animation */}
                                    <Box
                                        sx={{
                                            order: { xs: 1, md: isOdd ? 2 : 1 },
                                            height: { xs: 400, md: 550 },
                                            borderRadius: { xs: 6, md: 8 },
                                            overflow: 'hidden',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                                            mx: { xs: 'auto', md: 0 },
                                            width: { xs: '90%', md: '100%' },
                                            opacity: 0,
                                            animation: 'scaleIn 1s ease-out forwards',
                                            animationDelay: '0.4s',
                                            '@keyframes scaleIn': {
                                                from: { opacity: 0, scale: 0.95 },
                                                to: { opacity: 1, scale: 1 },
                                            },
                                            transition: 'transform 0.6s ease, box-shadow 0.6s ease',
                                            '&:hover': {
                                                transform: 'translateY(-12px) scale(1.03)',
                                                boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
                                                '& .imageOverlay': {
                                                    opacity: 1,
                                                },
                                                '& img': {
                                                    transform: 'scale(1.1)',
                                                },
                                            },
                                            position: 'relative',
                                        }}
                                    >
                                        <Box
                                            className="imageOverlay"
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                bgcolor: 'rgba(0,0,0,0.3)',
                                                opacity: 0,
                                                transition: 'opacity 0.5s ease',
                                                zIndex: 1,
                                            }}
                                        />

                                        {service.backgroundImage ? (
                                            <img
                                                src={`${service.backgroundImage}?w=1200&h=900&fit=crop`}
                                                alt={service.title}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    display: 'block',
                                                    transition: 'transform 0.8s ease',
                                                }}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    bgcolor: 'grey.300',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Typography variant="h5" color="text.secondary">
                                                    No image uploaded
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
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