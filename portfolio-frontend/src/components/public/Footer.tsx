// src/components/public/Footer.tsx
import { Box, Typography } from '@mui/material';

export default function Footer() {
    return (
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3, mt: 'auto' }}>
            <Typography align="center">© 2025 Construction Portfolio. All rights reserved.</Typography>
        </Box>
    );
}