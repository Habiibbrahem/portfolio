// src/components/public/sections/HeroSection.tsx
import { Box, Typography } from '@mui/material';

interface HeroData {
    title?: string;
    subtitle?: string;
    content?: string;
    backgroundImage?: string;
}

export default function HeroSection({ data }: { data: HeroData }) {
    return (
        <Box
            sx={{
                height: '90vh',
                backgroundImage: data.backgroundImage ? `url(${data.backgroundImage})` : 'linear-gradient(135deg, #FF5722 0%, #FFC107 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
        >
            <Box sx={{ maxWidth: '800px', px: 3 }}>
                <Typography variant="h1" gutterBottom>{data.title || 'Construction Excellence'}</Typography>
                <Typography variant="h4" gutterBottom>{data.subtitle || 'Building Your Future'}</Typography>
                <Typography variant="h6" dangerouslySetInnerHTML={{ __html: data.content || '' }} />
            </Box>
        </Box>
    );
}