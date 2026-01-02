// src/pages/admin/Login.tsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Alert,
    CircularProgress,
    Container,
    IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../api/client';

const getContact = async () => {
    try {
        const { data } = await api.get('/cms/contact');
        return data.data || {};
    } catch {
        return {};
    }
};

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const { data: contactData = {} } = useQuery({
        queryKey: ['contact'],
        queryFn: getContact,
    });

    const backgroundImage = contactData.backgroundImage || '/construction-bg.jpg';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const data = response.data;

            const accessToken = data.access_token || data.accessToken;
            const refreshToken = data.refresh_token || data.refreshToken;

            if (!accessToken) throw new Error('No access token received');

            login({
                accessToken,
                refreshToken,
                user: data.user || data,
            });

            localStorage.setItem('accessToken', accessToken);
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

            setTimeout(() => navigate('/admin/dashboard'), 800);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Invalid credentials';
            setError(`Login failed: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    // Go back to previous page or home
    const handleGoBack = () => {
        if (location.key !== 'default') {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,41,59,0.7) 100%)',
                    zIndex: 1,
                },
            }}
        >
            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
                <Paper
                    elevation={12}
                    sx={{
                        p: { xs: 4, md: 6 },
                        borderRadius: 4,
                        bgcolor: 'rgba(255, 255, 255, 0.92)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        position: 'relative',
                    }}
                >
                    {/* Back to Website Button - Top Left */}
                    <IconButton
                        onClick={handleGoBack}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            bgcolor: 'secondary.main',
                            color: 'black',
                            width: 48,
                            height: 48,
                            '&:hover': {
                                bgcolor: 'secondary.dark',
                                transform: 'scale(1.1)',
                            },
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)',
                        }}
                        aria-label="Back to website"
                    >
                        <ArrowBackIcon fontSize="medium" />
                    </IconButton>

                    {/* Logo & Title */}
                    <Box sx={{ textAlign: 'center', mb: 4, pt: 4 }}>
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                bgcolor: 'secondary.main',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'black',
                                fontSize: '3rem',
                                fontWeight: 'bold',
                                mx: 'auto',
                                mb: 3,
                                boxShadow: '0 8px 20px rgba(251, 191, 36, 0.4)',
                            }}
                        >
                            C
                        </Box>
                        <Typography
                            variant="h3"
                            fontWeight={900}
                            color="primary.main"
                            gutterBottom
                            sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}
                        >
                            CONSTRUCT
                        </Typography>
                        <Typography variant="h6" color="text.secondary" fontWeight={500}>
                            Admin Portal
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Login Form */}
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            label="Email Address"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="username"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    bgcolor: 'white',
                                },
                            }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    bgcolor: 'white',
                                },
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={loading}
                            sx={{
                                mt: 5,
                                py: 2,
                                fontSize: '1.2rem',
                                fontWeight: 700,
                                borderRadius: 3,
                                bgcolor: 'secondary.main',
                                color: 'black',
                                boxShadow: '0 8px 25px rgba(251, 191, 36, 0.4)',
                                '&:hover': {
                                    bgcolor: 'secondary.dark',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 12px 30px rgba(251, 191, 36, 0.5)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {loading ? <CircularProgress size={28} color="inherit" /> : 'Enter Dashboard'}
                        </Button>
                    </Box>

                    {/* Footer Note */}
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 6 }}>
                        Secure Access • Construct CMS © 2026
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}