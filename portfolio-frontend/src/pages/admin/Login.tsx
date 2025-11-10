// src/pages/admin/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { useAuthStore } from '../../store/useAuthStore.ts';
import api from '../../api/client.ts';

export default function Login() {
    const [email, setEmail] = useState('admin@construct.com');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const data = response.data;

            console.log('FULL LOGIN RESPONSE:', data);

            // ← FIX: BACKEND USES snake_case
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

            setSuccess('Login successful! Welcome back.');
            setTimeout(() => navigate('/admin/dashboard'), 800);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Invalid credentials';
            setError(`Login failed: ${msg}`);
            console.error('Login error:', err.response?.data || err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
            <Paper elevation={24} sx={{ p: 7, width: { xs: '90%', sm: 520 }, borderRadius: 5 }}>
                <Typography variant="h3" align="center" gutterBottom color="#FF5722" fontWeight="bold">
                    CONSTRUCTION CMS
                </Typography>

                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
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
                    <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 4, py: 2, bgcolor: '#FF5722' }}>
                        {loading ? <CircularProgress size={32} /> : 'LOGIN NOW'}
                    </Button>
                </Box>

                <Paper sx={{ mt: 4, p: 3, bgcolor: '#FFF3E0' }}>
                    <Typography align="center">Email: <strong>admin@construct.com</strong></Typography>
                    <Typography align="center">Password: <strong>admin123</strong></Typography>
                </Paper>
            </Paper>
        </Box>
    );
}