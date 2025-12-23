// src/pages/public/Contact.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Divider,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    AccessTime as ClockIcon,
} from '@mui/icons-material';
import PublicNavbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import api from '../../api/client';

interface ContactData {
    backgroundImage: string;
    addressLine1: string;
    addressLine2: string;
    phone1: string;
    phone2: string;
    phone3: string;
    email: string;
    hours: string;
}

const getContact = async (): Promise<ContactData> => {
    try {
        const { data } = await api.get('/cms/contact');
        return data.data;
    } catch (err) {
        return {
            backgroundImage: '',
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

export default function Contact() {
    const { data: contact, isLoading } = useQuery<ContactData>({
        queryKey: ['contact'],
        queryFn: getContact,
    });

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

    if (isLoading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundImage: contact?.backgroundImage ? `url(${contact.backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
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
            <PublicNavbar />

            <Box sx={{ flex: 1, py: { xs: 10, md: 16 }, position: 'relative', zIndex: 1 }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h2"
                        align="center"
                        fontWeight={900}
                        color="white"
                        textShadow="4px 4px 16px rgba(0,0,0,0.9)"
                        gutterBottom
                        sx={{ mb: { xs: 10, md: 14 }, fontSize: { xs: '3rem', md: '4.5rem' } }}
                    >
                        Contact
                    </Typography>

                    <Grid container spacing={6} justifyContent="center">
                        {/* Form Card */}
                        <Grid item xs={12} lg={10}>
                            <Paper
                                elevation={12}
                                sx={{
                                    p: { xs: 5, md: 8 },
                                    borderRadius: 5,
                                    bgcolor: 'rgba(255, 255, 255, 0.94)',
                                    backdropFilter: 'blur(12px)',
                                    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                                    position: 'relative',
                                }}
                            >
                                <Typography variant="h4" fontWeight={700} color="primary.main" mb={6} align="center">
                                    Send us a message
                                </Typography>

                                {submitStatus === 'success' && (
                                    <Alert severity="success" sx={{ mb: 4 }}>
                                        Message sent successfully! We will get back to you soon.
                                    </Alert>
                                )}
                                {submitStatus === 'error' && (
                                    <Alert severity="error" sx={{ mb: 4 }}>
                                        Failed to send message. Please try again later.
                                    </Alert>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={5}>
                                        <Grid item xs={12} md={5}>
                                            <Grid container spacing={4} direction="column">
                                                <Grid item>
                                                    <TextField
                                                        fullWidth
                                                        label="Name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                        variant="outlined"
                                                        sx={{ bgcolor: 'white' }}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        fullWidth
                                                        label="Email"
                                                        name="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        variant="outlined"
                                                        sx={{ bgcolor: 'white' }}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        fullWidth
                                                        label="Phone"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        variant="outlined"
                                                        sx={{ bgcolor: 'white' }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12} md={7}>
                                            <TextField
                                                fullWidth
                                                label="Message"
                                                name="message"
                                                multiline
                                                rows={10}
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                variant="outlined"
                                                sx={{ bgcolor: 'white' }}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    disabled={submitStatus === 'loading'}
                                                    sx={{
                                                        py: 1.3,
                                                        px: 6,
                                                        fontSize: '1.1rem',
                                                        fontWeight: 700,
                                                        bgcolor: 'secondary.main',
                                                        '&:hover': { bgcolor: 'secondary.dark' },
                                                    }}
                                                >
                                                    {submitStatus === 'loading' ? 'SENDING...' : 'SEND'}
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Paper>
                        </Grid>

                        {/* Info Card */}
                        <Grid item xs={12} lg={10}>
                            <Paper
                                elevation={12}
                                sx={{
                                    p: { xs: 5, md: 8 },
                                    borderRadius: 5,
                                    bgcolor: 'rgba(255, 255, 255, 0.94)',
                                    backdropFilter: 'blur(12px)',
                                    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                                    mt: { xs: 8, md: 12 },
                                }}
                            >
                                <Typography variant="h4" fontWeight={700} color="primary.main" mb={6} align="center">
                                    Our Contact Information
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                                        <LocationIcon sx={{ color: 'secondary.main', fontSize: 36, mt: 0.5 }} />
                                        <Box>
                                            <Typography variant="h6" fontWeight={600}>
                                                {contact?.addressLine1}
                                            </Typography>
                                            <Typography variant="body1">{contact?.addressLine2}</Typography>
                                        </Box>
                                    </Box>

                                    <Divider />

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <PhoneIcon sx={{ color: 'secondary.main', fontSize: 32 }} />
                                        <Box>
                                            <Typography variant="body1">{contact?.phone1}</Typography>
                                            <Typography variant="body1">{contact?.phone2}</Typography>
                                            <Typography variant="body1">{contact?.phone3}</Typography>
                                        </Box>
                                    </Box>

                                    <Divider />

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <EmailIcon sx={{ color: 'secondary.main', fontSize: 32 }} />
                                        <Typography variant="body1">{contact?.email}</Typography>
                                    </Box>

                                    <Divider />

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <ClockIcon sx={{ color: 'secondary.main', fontSize: 32 }} />
                                        <Typography variant="body1">{contact?.hours}</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Footer />
        </Box>
    );
}