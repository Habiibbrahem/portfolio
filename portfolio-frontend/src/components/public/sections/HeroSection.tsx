import { Box, Typography, Container } from '@mui/material';

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
                height: '100vh',
                backgroundImage: data.backgroundImage
                    ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${data.backgroundImage})`
                    : 'linear-gradient(135deg, #1a365d 0%, #d97706 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                color: 'white',
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{
                    textAlign: 'left',
                    maxWidth: '600px'
                }}>
                    <Typography
                        variant="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            lineHeight: 1.1,
                            mb: 3
                        }}
                    >
                        {data.title}
                    </Typography>
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                            fontWeight: 400,
                            opacity: 0.9,
                            mb: 4
                        }}
                    >
                        {data.subtitle}
                    </Typography>
                    {data.content && (
                        <Typography
                            variant="h6"
                            sx={{
                                opacity: 0.8,
                                lineHeight: 1.6
                            }}
                            dangerouslySetInnerHTML={{ __html: data.content }}
                        />
                    )}
                </Box>
            </Container>
        </Box>
    );
}