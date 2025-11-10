import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box, Button, TextField, Typography, Alert, CircularProgress,
    Paper, Tabs, Tab, IconButton, Stack
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import { getHero, updateHero, getSections } from '../../api/cms';
import { uploadImage, deleteImage } from '../../api/upload';
import api from '../../api/client';
import type { CmsSection } from '../../types/cms';

export default function ContentManager() {
    const queryClient = useQueryClient();
    const [tab, setTab] = useState(0);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [backgroundImage, setBackgroundImage] = useState('');
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
            setSuccess('Hero section updated successfully');
            setTimeout(() => setSuccess(''), 4000);
        },
        onError: (err: any) => {
            setError(`Save failed: ${err.response?.data?.message || 'Please try again'}`);
            setTimeout(() => setError(''), 5000);
        },
    });

    // Auto-fill form
    useEffect(() => {
        if (hero) {
            setTitle(hero.data?.title || '');
            setSubtitle(hero.data?.subtitle || '');
            setContent(hero.data?.content || '');
            setBackgroundImage(hero.data?.backgroundImage || '');
        }
    }, [hero]);

    const handleSave = () => {
        if (!title.trim() || !subtitle.trim()) {
            setError('Title and subtitle are required');
            return;
        }
        mutation.mutate({
            title: title.trim(),
            subtitle: subtitle.trim(),
            content: content || '<p>Professional construction services</p>',
            backgroundImage,
        });
    };

    const handleUploadBackground = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const url = await uploadImage(file);
            setBackgroundImage(url);
            setSuccess('Background image uploaded!');
        } catch {
            setError('Upload failed');
        }
    };

    const removeBackground = () => {
        setBackgroundImage('');
        setSuccess('Background removed');
    };

    if (heroLoading || sectionsLoading) {
        return <Box sx={{ p: 8, textAlign: 'center' }}><CircularProgress /></Box>;
    }

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 1000, mx: 'auto', borderRadius: 3 }}>
            <Typography variant="h4" gutterBottom color="primary.main" fontWeight="bold">
                Content Management
            </Typography>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 4 }}>
                <Tab label="Hero Section" />
                <Tab label="Page Sections" />
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
                    />
                    <TextField
                        label="Subtitle"
                        fullWidth
                        margin="normal"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                    />
                    <TextField
                        label="Content HTML"
                        fullWidth
                        multiline
                        rows={6}
                        margin="normal"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    {/* BACKGROUND IMAGE PICKER */}
                    <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Hero Background Image</Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button variant="outlined" component="label">
                            <PhotoCameraIcon sx={{ mr: 1 }} />
                            Upload New Background
                            <input type="file" hidden accept="image/*" onChange={handleUploadBackground} />
                        </Button>
                        {backgroundImage && (
                            <IconButton color="error" onClick={removeBackground}>
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </Stack>

                    {backgroundImage && (
                        <Box sx={{ mt: 2, borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
                            <img
                                src={`${backgroundImage}?w=800&h=600&fit=cover`}
                                alt="Hero background preview"
                                style={{ width: '100%', display: 'block' }}
                            />
                        </Box>
                    )}

                    <Button variant="contained" size="large" onClick={handleSave} sx={{ mt: 4 }}>
                        Save Changes
                    </Button>

                    <Alert severity="info" sx={{ mt: 3 }}>
                        Changes appear instantly on the live site. Use Media Manager to browse all images.
                    </Alert>
                </>
            )}

            {tab === 1 && (
                <Alert severity="info">
                    {sections.length} sections available. Full editor coming soon!
                </Alert>
            )}
        </Paper>
    );
}