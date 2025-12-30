import { Box, Container, Typography, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function Footer() {
    return (
        <Box
            sx={{
                bgcolor: 'primary.main',
                color: 'white',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url(/construction-site.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.3,
                },
            }}
        >
            <Container maxWidth="lg" sx={{ py: 10, position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} mb={4}>
                    CONSTRUCT
                </Typography>
                <Box sx={{ mb: 4 }}>
                    <IconButton sx={{ color: 'white', mx: 1 }}><FacebookIcon /></IconButton>
                    <IconButton sx={{ color: 'white', mx: 1 }}><TwitterIcon /></IconButton>
                    <IconButton sx={{ color: 'white', mx: 1 }}><LinkedInIcon /></IconButton>
                    <IconButton sx={{ color: 'white', mx: 1 }}><InstagramIcon /></IconButton>
                </Box>
                <Typography variant="body2" opacity={0.8}>
                    © 2024 Your Company. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}