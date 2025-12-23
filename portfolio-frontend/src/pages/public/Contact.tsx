// src/pages/public/Contact.tsx
import { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Paper,
} from '@mui/material';
import PublicNavbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // Simulate submission (replace with real API call later)
        setTimeout(() => {
            console.log('Contact form submitted:', formData);
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        }, 1000);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.default',
            }}
        >
            <PublicNavbar />

            <Box sx={{ flex: 1, py: 8 }}>
                <Container maxWidth="md">
                    <Paper elevation={3} sx={{ p: { xs: 4, md: 6 }, borderRadius: 3 }}>
                        <Typography variant="h3" component="h1" gutterBottom align="center" fontWeight={700}>
                            Get in Touch
                        </Typography>
                        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 5 }}>
                            I'd love to hear from you! Send me a message and I'll get back as soon as possible.
                        </Typography>

                        {status === 'success' && (
                            <Alert severity="success" sx={{ mb: 4 }}>
                                Thank you! Your message has been sent successfully.
                            </Alert>
                        )}

                        {status === 'error' && (
                            <Alert severity="error" sx={{ mb: 4 }}>
                                Something went wrong. Please try again later.
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField
                                required
                                fullWidth
                                label="Your Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                margin="normal"
                                disabled={status === 'loading'}
                            />
                            <TextField
                                required
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                margin="normal"
                                disabled={status === 'loading'}
                            />
                            <TextField
                                required
                                fullWidth
                                label="Message"
                                name="message"
                                multiline
                                rows={6}
                                value={formData.message}
                                onChange={handleChange}
                                margin="normal"
                                disabled={status === 'loading'}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={status === 'loading'}
                                sx={{
                                    mt: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    bgcolor: 'secondary.main',
                                    '&:hover': { bgcolor: 'secondary.dark' },
                                }}
                            >
                                {status === 'loading' ? <CircularProgress size={28} color="inherit" /> : 'Send Message'}
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>

            <Footer />
        </Box>
    );
}