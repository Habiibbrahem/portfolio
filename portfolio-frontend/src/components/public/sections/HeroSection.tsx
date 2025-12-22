import { Box, Typography, Container } from '@mui/material';
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
    const intervalMs = data.carouselInterval || 6000;
    const showText = data.showOverlayText !== false;

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance carousel
    useEffect(() => {
        if (images.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, intervalMs);

        return () => clearInterval(timer);
    }, [images.length, intervalMs]);

    // Preload all images for instant transitions
    useEffect(() => {
        images.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, [images]);

    // Fallback if no images
    if (images.length === 0) {
        return (
            <Box
                sx={{
                    height: '100vh',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                }}
            >
                <Typography variant="h2">Your Portfolio</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100vh', position: 'relative', overflow: 'hidden', color: 'white' }}>
            {/* Image Layers with Fade + Subtle Zoom */}
            {images.map((src, idx) => (
                <Box
                    key={idx}
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${src})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: idx === currentIndex ? 1 : 0,
                        transform: idx === currentIndex ? 'scale(1.05)' : 'scale(1.15)',
                        transition:
                            'opacity 2.2s cubic-bezier(0.22, 1, 0.36, 1), transform 16s ease-out',
                        zIndex: idx === currentIndex ? 1 : 0,
                    }}
                />
            ))}

            {/* Gradient Overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.75) 100%)',
                    zIndex: 2,
                }}
            />

            {/* Elegant Dots Indicator */}
            {images.length > 1 && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: { xs: 32, md: 56 },
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: 1.8,
                        zIndex: 10,
                    }}
                >
                    {images.map((_, idx) => (
                        <Box
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            sx={{
                                width: currentIndex === idx ? 40 : 12,
                                height: 12,
                                borderRadius: '30px',
                                bgcolor: currentIndex === idx ? 'white' : 'rgba(255,255,255,0.5)',
                                cursor: 'pointer',
                                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': { bgcolor: 'white', transform: 'scale(1.1)' },
                            }}
                        />
                    ))}
                </Box>
            )}

            {/* Hero Text with Smooth Entrance */}
            {showText && (
                <Container
                    maxWidth="lg"
                    sx={{
                        position: 'relative',
                        zIndex: 10,
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: '1000px',
                            textAlign: { xs: 'center', md: 'left' },
                            mx: 'auto',
                            px: { xs: 3, md: 0 },
                            animation: 'fadeInUp 1.6s ease-out',
                            '@keyframes fadeInUp': {
                                '0%': { opacity: 0, transform: 'translateY(50px)' },
                                '100%': { opacity: 1, transform: 'translateY(0)' },
                            },
                        }}
                    >
                        <Typography
                            variant="h1"
                            component="h1"
                            sx={{
                                fontSize: { xs: '3.2rem', sm: '4.5rem', md: '6rem' },
                                fontWeight: 900,
                                lineHeight: 1,
                                letterSpacing: '-0.04em',
                                mb: 3,
                                textShadow: '0 10px 40px rgba(0,0,0,0.8)',
                            }}
                        >
                            {data.title || 'Hi, I\'m Developer'}
                        </Typography>

                        <Typography
                            variant="h3"
                            sx={{
                                fontSize: { xs: '1.9rem', md: '3.2rem' },
                                fontWeight: 600,
                                mb: 4,
                                textShadow: '0 6px 30px rgba(0,0,0,0.7)',
                            }}
                        >
                            {data.subtitle || 'Building the Future'}
                        </Typography>

                        {data.content && (
                            <Typography
                                variant="h5"
                                sx={{
                                    opacity: 0.95,
                                    lineHeight: 1.7,
                                    maxWidth: '700px',
                                    mx: { xs: 'auto', md: 0 },
                                    textShadow: '0 4px 20px rgba(0,0,0,0.6)',
                                }}
                                dangerouslySetInnerHTML={{ __html: data.content }}
                            />
                        )}
                    </Box>
                </Container>
            )}
        </Box>
    );
}