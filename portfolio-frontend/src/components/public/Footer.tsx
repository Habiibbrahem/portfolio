import { Box, Container, Typography, Divider } from '@mui/material';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'primary.main',
                color: 'white',
                py: 6,
                mt: 'auto'
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center' }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            mb: 2
                        }}
                    >
                        CONSTRUCT
                    </Typography>
                    <Divider
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            mb: 3,
                            mx: 'auto',
                            width: '100px'
                        }}
                    />
                    <Typography
                        variant="body2"
                        sx={{
                            opacity: 0.8
                        }}
                    >
                        © {currentYear} Construct Building Solutions. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}