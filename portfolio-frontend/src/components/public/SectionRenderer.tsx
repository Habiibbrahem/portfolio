// src/components/public/SectionRenderer.tsx
import { useQuery } from '@tanstack/react-query';
import { Box, Container } from '@mui/material';
import HeroSection from './sections/HeroSection';  // ← FIXED: CORRECT PATH TO YOUR FILE
import { getSections, getHero } from '../../api/cms.ts';
import type { CmsSection } from '../../types/cms.ts';

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
        <Box>
            {hero && <HeroSection data={hero.data} />}
            {publishedSections.map(section => (
                <Container key={section._id} sx={{ py: 8 }}>
                    <div dangerouslySetInnerHTML={{ __html: section.data.content || `<h2>${section.section}</h2>` }} />
                </Container>
            ))}
        </Box>
    );
}