// src/components/public/SectionRenderer.tsx
import { useQuery } from '@tanstack/react-query';
import { Box, Container } from '@mui/material';
import HeroSection from './sections/HeroSection'; // This path is correct
import { getSections, getHero } from '../../api/cms';
import type { CmsSection } from '../../types/cms';

export default function SectionRenderer() {
    const { data: sections = [] } = useQuery<CmsSection[]>({
        queryKey: ['sections'],
        queryFn: getSections,
    });

    const { data: heroSection } = useQuery<CmsSection>({
        queryKey: ['hero'],
        queryFn: getHero,
    });

    const hero = heroSection?.published !== false ? heroSection : null;

    const publishedSections = sections
        .filter(s => s.published !== false && s.section !== 'hero' && s.section !== 'navbar')
        .sort((a, b) => a.order - b.order);

    return (
        <Box component="main">
            {hero && <HeroSection data={hero.data} />}

            {publishedSections.map(section => (
                <Box
                    key={section._id}
                    sx={{
                        py: { xs: 6, md: 10 },
                        bgcolor: section.data.background === 'secondary' ? 'background.paper' : 'background.default',
                        borderBottom: section.data.background === 'secondary' ? '1px solid' : 'none',
                        borderColor: 'divider'
                    }}
                >
                    <Container maxWidth="lg">
                        <Box
                            sx={{
                                '& h2': {
                                    color: 'primary.main',
                                    fontSize: { xs: '2rem', md: '2.5rem' },
                                    fontWeight: 700,
                                    mb: 3,
                                    textAlign: 'center'
                                },
                                '& h3': {
                                    color: 'secondary.main',
                                    fontSize: '1.5rem',
                                    fontWeight: 600,
                                    mb: 2
                                },
                                '& p': {
                                    color: 'text.primary',
                                    lineHeight: 1.7,
                                    mb: 2
                                },
                                '& ul, & ol': {
                                    pl: 3,
                                    mb: 2
                                },
                                '& li': {
                                    color: 'text.primary',
                                    lineHeight: 1.7,
                                    mb: 1
                                }
                            }}
                            dangerouslySetInnerHTML={{
                                __html: section.data.content || `<h2>${section.section}</h2>`
                            }}
                        />
                    </Container>
                </Box>
            ))}
        </Box>
    );
}