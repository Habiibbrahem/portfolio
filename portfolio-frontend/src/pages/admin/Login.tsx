import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../api/client';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuthStore();
    const navigate = useNavigate();

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

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default'
        }}>
            <Paper elevation={3} sx={{ p: 5, width: { xs: '90%', sm: 450 }, borderRadius: 3 }}>
                <Typography variant="h4" align="center" gutterBottom color="primary.main" fontWeight="bold">
                    Construct CMS
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                    Admin Login
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="username"
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
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 4, py: 1.5 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Login'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}