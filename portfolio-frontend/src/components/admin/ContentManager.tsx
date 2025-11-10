// src/components/admin/ContentManager.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Button, TextField, Typography, Alert, CircularProgress, Paper, Tabs, Tab } from '@mui/material';
import { getHero, updateHero, getSections } from '../../api/cms.ts';  // ← FIXED IMPORT
import type { CmsSection } from '../../types/cms.ts';

export default function ContentManager() {
    const queryClient = useQueryClient();
    const [tab, setTab] = useState(0);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const { data: hero, isLoading: heroLoading } = useQuery<CmsSection>({
        queryKey: ['hero'],
        queryFn: getHero,
    });

    const { data: sections = [], isLoading: sectionsLoading } = useQuery<CmsSection[]>({
        queryKey: ['sections'],
        queryFn: getSections,
    });

    const mutation = useMutation({
        mutationFn: updateHero,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hero'] });
            setSuccess('✅ Hero updated & LIVE!');
            setTimeout(() => setSuccess(''), 4000);
        },
        onError: (err: any) => {
            setError(`❌ ${err.response?.data?.message || 'Save failed'}`);
        },
    });

    const handleSave = () => {
        if (!title.trim() || !subtitle.trim()) {
            setError('Title and Subtitle required!');
            return;
        }
        mutation.mutate({
            title: title.trim(),
            subtitle: subtitle.trim(),
            content: content || '<p>Welcome to our construction company.</p>',
        });
    };

    if (heroLoading || sectionsLoading) {
        return <Box sx={{ p: 8, textAlign: 'center' }}><CircularProgress /></Box>;
    }

    // Auto-fill on load
    if (hero && !title) {
        setTitle(hero.data?.title || '');
        setSubtitle(hero.data?.subtitle || '');
        setContent(hero.data?.content || '');
    }

    return (
        <Paper elevation={6} sx={{ p: 6, maxWidth: 1000, mx: 'auto', borderRadius: 4 }}>
            <Typography variant="h3" gutterBottom color="#FF5722" fontWeight="bold" align="center">
                Content Manager
            </Typography>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 4 }}>
                <Tab label="Hero Section" />
                <Tab label="Other Sections" />
            </Tabs>

            {tab === 0 && (
                <>
                    {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    <TextField
                        label="Main Title"
                        fullWidth
                        margin="normal"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Building Dreams"
                    />
                    <TextField
                        label="Subtitle"
                        fullWidth
                        margin="normal"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="Excellence Since 2010"
                    />
                    <TextField
                        label="Content HTML"
                        fullWidth
                        multiline
                        rows={6}
                        margin="normal"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="<p>We deliver quality...</p>"
                    />

                    <Button variant="contained" size="large" onClick={handleSave} sx={{ mt: 3, px: 6 }}>
                        SAVE & UPDATE LIVE
                    </Button>

                    <Alert severity="success" sx={{ mt: 4 }}>
                        Changes appear <strong>INSTANTLY</strong> on homepage → <a href="/" target="_blank">View Site</a>
                    </Alert>
                </>
            )}

            {tab === 1 && (
                <Alert severity="info">
                    {sections.length} sections loaded. Full editor coming soon!
                </Alert>
            )}
        </Paper>
    );
}