import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Overview() {
    const navigate = useNavigate();

    return (
        <Box>
            <Typography variant="h4" gutterBottom color="primary.main" fontWeight="bold">
                Construction CMS Dashboard
            </Typography>
            <Typography variant="body1" gutterBottom color="text.secondary" sx={{ mb: 4 }}>
                Manage your construction company website content and media
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                            Quick Start
                        </Typography>
                        <Typography variant="body2" paragraph>
                            1. Manage Navigation - Add menu items
                        </Typography>
                        <Typography variant="body2" paragraph>
                            2. Edit Content - Update hero and sections
                        </Typography>
                        <Typography variant="body2" paragraph>
                            3. Upload Media - Add images and files
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/admin/dashboard/navbar')}
                            sx={{ mt: 2 }}
                        >
                            Get Started
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h5" gutterBottom sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                            Features
                        </Typography>
                        <Typography variant="body2" paragraph>
                            • Live content updates
                        </Typography>
                        <Typography variant="body2" paragraph>
                            • Drag & drop navigation
                        </Typography>
                        <Typography variant="body2" paragraph>
                            • Media management
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}