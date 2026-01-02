// src/components/public/sections/HeroSection.tsx
import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface HeroData {
    title?: string;
    subtitle?: string;
    content?: string;
    backgroundImages?: string[];
    carouselInterval?: number;
    showOverlayText?: boolean;
}

export default function HeroSection({ data }: { data: HeroData }) {
    const images = data.backgroundImages || [];
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance carousel
    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, data.carouselInterval || 6000);

        return () => clearInterval(interval);
    }, [images.length, data.carouselInterval]);

    // Preload all images
    useEffect(() => {
        images.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, [images]);

    if (images.length === 0) {
        return (
            <Box
                sx={{
                    height: '100vh',
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                }}
            >
                <Typography variant="h1" fontWeight={900}>
                    CONSTRUCT
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                height: '100vh',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background Images with Fade Transition */}
            {images.map((src, index) => (
                <Box
                    key={index}
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${src})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: index === currentIndex ? 1 : 0,
                        transition: 'opacity 2s ease-in-out',
                        zIndex: 0,
                    }}
                />
            ))}

            {/* Dark Overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.85) 100%)',
                    zIndex: 1,
                }}
            />

            {/* Content Overlay */}
            {data.showOverlayText !== false && (
                <Container
                    maxWidth="lg"
                    sx={{
                        position: 'relative',
                        zIndex: 2,
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ maxWidth: '900px', color: 'white' }}>
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '3.5rem', md: '5.5rem' },
                                fontWeight: 900,
                                lineHeight: 1.1,
                                mb: 3,
                                textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                            }}
                        >
                            {data.title || 'Building Your Future'}
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{
                                fontSize: { xs: '1.6rem', md: '2.2rem' },
                                fontWeight: 600,
                                mb: 6,
                                opacity: 0.95,
                                textShadow: '0 2px 10px rgba(0,0,0,0.7)',
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
                                sx={{
                                    px: 5,
                                    py: 2,
                                    fontSize: '1.2rem',
                                    bgcolor: 'secondary.main',
                                    color: 'black',
                                    fontWeight: 700,
                                    borderRadius: 3,
                                    '&:hover': { bgcolor: 'secondary.dark' },
                                }}
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
                                    fontWeight: 600,
                                    borderRadius: 3,
                                    '&:hover': {
                                        borderColor: 'secondary.main',
                                        bgcolor: 'secondary.main',
                                        color: 'black',
                                    },
                                }}
                            >
                                Contact Us
                            </Button>
                        </Box>
                    </Box>
                </Container>
            )}

            {/* Optional: Dots Indicator */}
            {images.length > 1 && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 40,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: 1.5,
                        zIndex: 10,
                    }}
                >
                    {images.map((_, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: currentIndex === index ? 32 : 10,
                                height: 10,
                                borderRadius: '30px',
                                bgcolor: currentIndex === index ? 'secondary.main' : 'rgba(255,255,255,0.5)',
                                transition: 'all 0.4s ease',
                                cursor: 'pointer',
                            }}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}