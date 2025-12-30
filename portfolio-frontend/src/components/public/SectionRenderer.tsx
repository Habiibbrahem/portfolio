import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Button,
    TextField,
    Alert,
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import HeroSection from './sections/HeroSection';
import api from '../../api/client';

const getHero = async () => (await api.get('/cms/hero')).data;

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
        return data.data;
    } catch {
        return {};
    }
};

export default function SectionRenderer() {
    const { data: hero } = useQuery({ queryKey: ['hero'], queryFn: getHero });
    const { data: news } = useQuery({ queryKey: ['news'], queryFn: getNews });
    const { data: servicesSection } = useQuery({ queryKey: ['services'], queryFn: getServices });
    const { data: contactData } = useQuery({ queryKey: ['contact'], queryFn: getContact });

    // Sort news by date descending (newest first)
    const sortedNewsItems = [...(news?.data?.items || [])].sort((a: any, b: any) =>
        new Date(b.date || Date.now()).getTime() - new Date(a.date || Date.now()).getTime()
    );

    const services = servicesSection?.data?.services || [];

    // Show More state
    const [showAllNews, setShowAllNews] = useState(false);
    const initialCount = 6;
    const visibleNews = showAllNews ? sortedNewsItems : sortedNewsItems.slice(0, initialCount);
    const hasMoreNews = sortedNewsItems.length > initialCount;

    // Contact form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus('loading');

        try {
            await api.post('/contact-messages', formData);
            setSubmitStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '' });
            setTimeout(() => setSubmitStatus('idle'), 5000);
        } catch (err) {
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus('idle'), 5000);
        }
    };

    return (
        <Box>
            {hero && <HeroSection data={hero.data} />}

            {/* Latest News */}
            {sortedNewsItems.length > 0 && (
                <Box sx={{ py: 12, bgcolor: 'background.default' }}>
                    <Container maxWidth="lg">
                        <Typography
                            variant="h4"
                            align="center"
                            color="primary.main"
                            mb={8}
                            sx={{ position: 'relative' }}
                        >
                            Latest News
                            <Box sx={{ height: 4, width: 80, bgcolor: 'secondary.main', mx: 'auto', mt: 2 }} />
                        </Typography>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                                gap: 4,
                            }}
                        >
                            {visibleNews.map((item: any) => (
                                <Box key={item.id}>
                                    <Card sx={{ height: '100%', borderRadius: 4, overflow: 'hidden', boxShadow: 3 }}>
                                        <Box sx={{ height: 240, position: 'relative' }}>
                                            {item.image ? (
                                                <img
                                                    src={`${item.image}?w=600&h=400&fit=crop`}
                                                    alt={item.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <Box
                                                    sx={{
                                                        height: '100%',
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
                                        </Box>
                                        <CardContent>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {dayjs(item.date || Date.now()).format('MMMM D, YYYY')}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Box>
                            ))}
                        </Box>

                        {hasMoreNews && !showAllNews && (
                            <Box sx={{ textAlign: 'center', mt: 8 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => setShowAllNews(true)}
                                    sx={{
                                        px: 6,
                                        py: 2,
                                        borderRadius: 12,
                                        bgcolor: 'secondary.main',
                                        color: 'black',
                                        fontWeight: 600,
                                        '&:hover': { bgcolor: 'secondary.dark' },
                                    }}
                                >
                                    Show More News
                                </Button>
                            </Box>
                        )}
                    </Container>
                </Box>
            )}

            {/* Our Services - Icon Cards */}
            {services.length > 0 && (
                <Box sx={{ py: 12, bgcolor: 'grey.50' }}>
                    <Container maxWidth="lg">
                        <Typography
                            variant="h4"
                            align="center"
                            color="primary.main"
                            mb={8}
                            sx={{ position: 'relative' }}
                        >
                            Our Services
                            <Box sx={{ height: 4, width: 80, bgcolor: 'secondary.main', mx: 'auto', mt: 2 }} />
                        </Typography>
                        <Grid container spacing={6}>
                            {services.map((s: any, i: number) => (
                                <Grid item xs={12} md={4} key={i}>
                                    <Card sx={{ textAlign: 'center', p: 6, height: '100%' }}>
                                        <Box sx={{ fontSize: 80, color: 'secondary.main', mb: 3 }}>🔨</Box>
                                        <Typography variant="h5" fontWeight="bold" mb={2}>
                                            {s.title}
                                        </Typography>
                                        <Typography color="text.secondary">{s.description}</Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>
            )}

            {/* Get In Touch - PERFECTLY MATCHING TEMPLATE */}
            <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: 'background.default' }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h4"
                        align="center"
                        color="primary.main"
                        mb={10}
                        sx={{ position: 'relative' }}
                    >
                        Get In Touch
                        <Box sx={{ height: 4, width: 80, bgcolor: 'secondary.main', mx: 'auto', mt: 2 }} />
                    </Typography>

                    <Grid container spacing={6} alignItems="stretch">
                        {/* Form - Left Side */}
                        <Grid item xs={12} md={6}>
                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                sx={{
                                    bgcolor: 'white',
                                    p: { xs: 4, md: 6 },
                                    borderRadius: 4,
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                {submitStatus === 'success' && (
                                    <Alert severity="success" sx={{ mb: 3 }}>
                                        Message sent successfully! We will reply soon.
                                    </Alert>
                                )}
                                {submitStatus === 'error' && (
                                    <Alert severity="error" sx={{ mb: 3 }}>
                                        Failed to send message. Please try again.
                                    </Alert>
                                )}

                                <Box sx={{ display: 'grid', gap: 3 }}>
                                    <TextField
                                        placeholder="Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        variant="standard"
                                        InputProps={{ disableUnderline: false }}
                                        sx={{ '& .MuiInput-underline:before': { borderBottomColor: 'grey.400' } }}
                                    />
                                    <TextField
                                        placeholder="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        variant="standard"
                                    />
                                    <TextField
                                        placeholder="Phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="standard"
                                    />
                                    <TextField
                                        placeholder="Message"
                                        name="message"
                                        multiline
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        variant="standard"
                                    />
                                </Box>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={submitStatus === 'loading'}
                                    sx={{
                                        mt: 4,
                                        py: 2,
                                        bgcolor: 'secondary.main',
                                        color: 'black',
                                        fontWeight: 700,
                                        borderRadius: 3,
                                        '&:hover': { bgcolor: 'secondary.dark' },
                                    }}
                                >
                                    {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
                                </Button>
                            </Box>
                        </Grid>

                        {/* Image - Right Side */}
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    height: { xs: 400, md: '100%' },
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                }}
                            >
                                {contactData?.homeImage ? (
                                    <img
                                        src={contactData.homeImage}
                                        alt="Contact us"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            height: '100%',
                                            bgcolor: 'grey.300',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography variant="h5" color="text.secondary">
                                            No image uploaded yet
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}