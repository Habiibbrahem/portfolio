import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    LinearProgress,
} from '@mui/material';
import HeroSection from './sections/HeroSection';
import api from '../../api/client';

interface ServiceItem {
    title: string;
    description: string;
    backgroundImage: string;
}

// Dedicated fetchers
const getHero = async () => {
    const { data } = await api.get('/cms/hero');
    return data;
};

const getNews = async () => {
    try {
        const { data } = await api.get('/cms/news');
        return data.published !== false ? data : null;
    } catch {
        return null;
    }
};

const getServices = async () => {
    try {
        const { data } = await api.get('/cms/services');
        return data.published !== false ? data : null;
    } catch {
        return null;
    }
};

const getContact = async () => {
    try {
        const { data } = await api.get('/cms/contact');
        return data.data || {};
    } catch {
        return {
            addressLine1: 'RUE IBN MAJ Z.I. SAINT GOBAIN',
            addressLine2: 'Megrine BEN AROUS 2014 Tunisie',
            phone1: '+ 216 71 428 807',
            phone2: '+ 216 71 428 851',
            phone3: '+ 216 71 296 152',
            email: 'info.snc@snrc.com.tn',
            hours: 'Monday - Saturday: 9:00 - 18:00',
        };
    }
};

export default function SectionRenderer() {
    const { data: heroSection } = useQuery({
        queryKey: ['hero'],
        queryFn: getHero,
    });

    const { data: newsSection, isLoading: newsLoading } = useQuery({
        queryKey: ['news'],
        queryFn: getNews,
        staleTime: 1000 * 60 * 5,
    });

    const { data: servicesSection } = useQuery({
        queryKey: ['services'],
        queryFn: getServices,
    });

    const { data: contactData } = useQuery({
        queryKey: ['contact'],
        queryFn: getContact,
    });

    const hero = heroSection?.published !== false ? heroSection : null;
    const newsItems = newsSection?.data?.items?.filter((item: any) => item.title?.trim()) || [];
    const services: ServiceItem[] = servicesSection?.data?.services || [];

    return (
        <Box component="main">
            {/* 1. HERO */}
            {hero && <HeroSection data={hero.data} />}

            {/* 2. NEWS SECTION */}
            {newsLoading && <LinearProgress />}
            {newsItems.length > 0 && (
                <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
                    <Container maxWidth="lg">
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            color="primary.main"
                            textAlign="center"
                            mb={6}
                        >
                            LATEST NEWS
                        </Typography>

                        <Grid container spacing={4}>
                            {newsItems.map((item: any, index: number) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            boxShadow: 3,
                                            transition: 'transform 0.3s',
                                            '&:hover': { transform: 'translateY(-8px)' },
                                        }}
                                    >
                                        {item.image ? (
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={`${item.image}?w=600&h=400&fit=crop`}
                                                alt={item.title}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    height: 200,
                                                    bgcolor: 'grey.300',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Typography variant="h6" color="text.secondary">
                                                    No Image
                                                </Typography>
                                            </Box>
                                        )}
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                {item.title}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>
            )}

            {/* 3. SERVICES SECTION */}
            {services.length > 0 && (
                <Box sx={{ py: { xs: 8, md: 12 } }}>
                    <Container maxWidth="lg">
                        <Typography
                            variant="h3"
                            component="h2"
                            align="center"
                            fontWeight={700}
                            color="primary.main"
                            gutterBottom
                            sx={{ mb: { xs: 10, md: 14 } }}
                        >
                            Our Services
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 12, md: 16 } }}>
                            {services.map((service, index) => {
                                const isOdd = index % 2 === 0;

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
            )}

            {/* 4. CONTACT INFO SECTION */}
            <Box
                sx={{
                    py: { xs: 10, md: 16 },
                    bgcolor: 'background.default',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)',
                        zIndex: 0,
                    },
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography
                        variant="h3"
                        align="center"
                        fontWeight={900}
                        color="white"
                        textShadow="4px 4px 16px rgba(0,0,0,0.9)"
                        gutterBottom
                        sx={{ mb: { xs: 10, md: 14 } }}
                    >
                        Contact Us
                    </Typography>

                    <Grid container spacing={6} justifyContent="center">
                        <Grid item xs={12} md={8} lg={6}>
                            <Box
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.94)',
                                    p: { xs: 5, md: 8 },
                                    borderRadius: 5,
                                    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                                    backdropFilter: 'blur(12px)',
                                }}
                            >
                                <Typography variant="h5" fontWeight={700} color="primary.main" mb={5} align="center">
                                    Get in Touch
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                                        <Typography variant="h6" color="secondary.main">📍</Typography>
                                        <Box>
                                            <Typography variant="h6" fontWeight={600}>{contactData?.addressLine1}</Typography>
                                            <Typography>{contactData?.addressLine2}</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <Typography variant="h6" color="secondary.main">📞</Typography>
                                        <Box>
                                            <Typography>{contactData?.phone1}</Typography>
                                            <Typography>{contactData?.phone2}</Typography>
                                            <Typography>{contactData?.phone3}</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <Typography variant="h6" color="secondary.main">✉️</Typography>
                                        <Typography>{contactData?.email}</Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <Typography variant="h6" color="secondary.main">🕒</Typography>
                                        <Typography>{contactData?.hours}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}