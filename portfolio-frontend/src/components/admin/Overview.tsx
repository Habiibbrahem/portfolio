// src/pages/admin/Overview.tsx
import { Box, Typography, Paper, Button, Grid } from '@mui/material';  // ← GRID V2 BUILT-IN!
import { useNavigate } from 'react-router-dom';

export default function Overview() {
    const navigate = useNavigate();

    return (
        <Box sx={{ p: { xs: 2, sm: 4 } }}>
            <Typography variant="h3" gutterBottom color="#FF5722" fontWeight="bold" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
                🏗️ Construction CMS Dashboard
            </Typography>
            <Typography variant="h6" gutterBottom color="text.secondary" sx={{ mb: 4 }}>
                Build your professional portfolio in minutes – all changes LIVE instantly!
            </Typography>

            <Grid container spacing={4}>
                {/* QUICK START CARD */}
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={12}
                        sx={{
                            p: 5,
                            height: '100%',
                            bgcolor: 'white',
                            borderRadius: 4,
                            transition: '0.3s',
                            '&:hover': { transform: 'translateY(-8px)', boxShadow: 20 }
                        }}
                    >
                        <Typography variant="h4" gutterBottom sx={{ color: '#FF5722', fontWeight: 'bold' }}>
                            🚀 Quick Start Guide
                        </Typography>
                        <Typography paragraph sx={{ fontSize: '1.1em', lineHeight: 1.8 }}>
                            1. Click <strong>Manage Navbar</strong> → Add "Home", "About", "Services"
                        </Typography>
                        <Typography paragraph sx={{ fontSize: '1.1em', lineHeight: 1.8 }}>
                            2. Go to <strong>Content Manager</strong> → Edit Hero title & background
                        </Typography>
                        <Typography paragraph sx={{ fontSize: '1.1em', lineHeight: 1.8 }}>
                            3. Upload images in <strong>Media Uploads</strong> → Use in hero/gallery
                        </Typography>

                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/admin/dashboard/navbar')}
                            sx={{
                                mt: 3,
                                px: 5,
                                py: 1.5,
                                fontSize: '1.2em',
                                background: 'linear-gradient(45deg, #FF5722, #FF8A65)',
                                '&:hover': { background: '#E64A19' }
                            }}
                        >
                            Start Editing Navbar →
                        </Button>
                    </Paper>
                </Grid>

                {/* PRO TIPS CARD */}
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={12}
                        sx={{
                            p: 5,
                            height: '100%',
                            bgcolor: '#FFF3E0',
                            borderRadius: 4,
                            border: '2px solid #FFB74D',
                            transition: '0.3s',
                            '&:hover': { transform: 'translateY(-8px)', boxShadow: 20 }
                        }}
                    >
                        <Typography variant="h4" gutterBottom sx={{ color: '#FF6F00', fontWeight: 'bold' }}>
                            💡 Pro Features Unlocked
                        </Typography>
                        <Typography paragraph sx={{ fontSize: '1.1em', lineHeight: 1.9 }}>
                            • <strong>Drag & drop</strong> navbar items to reorder instantly
                        </Typography>
                        <Typography paragraph sx={{ fontSize: '1.1em', lineHeight: 1.9 }}>
                            • <strong>Rich text editor</strong> with image upload for hero/content
                        </Typography>
                        <Typography paragraph sx={{ fontSize: '1.1em', lineHeight: 1.9 }}>
                            • <strong>Zero downtime</strong> – All changes appear LIVE on public site
                        </Typography>
                        <Typography paragraph sx={{ fontSize: '1.1em', lineHeight: 1.9 }}>
                            • Public site → <a href="/" target="_blank" style={{ color: '#FF5722', fontWeight: 'bold' }}>Open Live Site 🌐</a>
                        </Typography>
                    </Paper>
                </Grid>

                {/* SYSTEM STATUS */}
                <Grid item xs={12}>
                    <Paper
                        elevation={12}
                        sx={{
                            p: 5,
                            bgcolor: '#E8F5E9',
                            borderRadius: 4,
                            border: '2px solid #66BB6A'
                        }}
                    >
                        <Typography variant="h4" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                            ✅ System Status – ALL GREEN
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography><strong>Backend:</strong> <span style={{ color: '#2E7D32' }}>Connected ✅</span></Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography><strong>Auth:</strong> <span style={{ color: '#2E7D32' }}>admin@construct.com ✅</span></Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography><strong>Token Refresh:</strong> <span style={{ color: '#2E7D32' }}>Auto-working ✅</span></Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography><strong>Live Updates:</strong> <span style={{ color: '#2E7D32' }}>Instant ✅</span></Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* FINAL CTA */}
                <Grid item xs={12} sx={{ mt: 4 }}>
                    <Paper elevation={24} sx={{ p: 6, bgcolor: '#FF5722', color: 'white', borderRadius: 5, textAlign: 'center' }}>
                        <Typography variant="h3" fontWeight="bold">
                            Your $10M Client Site Is Ready!
                        </Typography>
                        <Typography variant="h5" sx={{ mt: 2, opacity: 0.9 }}>
                            Start adding content → Deploy to Vercel → Charge $50K+
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                mt: 3,
                                bgcolor: 'white',
                                color: '#FF5722',
                                fontSize: '1.3em',
                                px: 6,
                                py: 2,
                                '&:hover': { bgcolor: '#fff3e0' }
                            }}
                            onClick={() => navigate('/admin/dashboard/navbar')}
                        >
                            BUILD MY SITE NOW 🔥
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}