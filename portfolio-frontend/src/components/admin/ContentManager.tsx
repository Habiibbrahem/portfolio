import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    CircularProgress,
    Paper,
    IconButton,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';

import { getHero, updateHero } from '../../api/cms';
import { uploadImage } from '../../api/upload';
import type { CmsSection } from '../../types/cms';

export default function ContentManager() {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
    const [carouselInterval, setCarouselInterval] = useState(6000);

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const { data: hero, isLoading } = useQuery<CmsSection>({
        queryKey: ['hero'],
        queryFn: getHero,
    });

    const mutation = useMutation({
        mutationFn: updateHero,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hero'] });
            setSuccess('Hero carousel saved successfully!');
            setTimeout(() => setSuccess(''), 4000);
        },
        onError: () => {
            setError('Save failed. Please try again.');
            setTimeout(() => setError(''), 5000);
        },
    });

    useEffect(() => {
        if (hero) {
            setTitle(hero.data?.title || '');
            setSubtitle(hero.data?.subtitle || '');
            setContent(hero.data?.content || '');
            setBackgroundImages(hero.data?.backgroundImages || []);
            setCarouselInterval(hero.data?.carouselInterval || 6000);
        }
    }, [hero]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setSuccess(`Uploading ${files.length} image(s)...`);

        try {
            const urls = await Promise.all(files.map((file) => uploadImage(file)));
            setBackgroundImages((prev) => [...prev, ...urls]);
            setSuccess(`${urls.length} image(s) uploaded successfully!`);

            // Reset file input so you can re-select the same files
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            console.error(err);
            setError('Upload failed');
        }
    };

    const removeImage = (index: number) => {
        setBackgroundImages((prev) => prev.filter((_, i) => i !== index));
        setSuccess('Image removed');
    };

    const handleSave = () => {
        if (!title.trim() || !subtitle.trim()) {
            setError('Title and subtitle are required');
            return;
        }

        mutation.mutate({
            title: title.trim(),
            subtitle: subtitle.trim(),
            content: content.trim(),
            backgroundImages,
            carouselInterval,
            showOverlayText: true,
        });
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Paper elevation={4} sx={{ p: { xs: 4, md: 6 }, maxWidth: 1200, mx: 'auto', borderRadius: 4 }}>
            <Typography variant="h4" fontWeight="bold" color="primary" mb={5}>
                Hero Carousel Manager
            </Typography>

            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <TextField
                label="Title"
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
                label="Content (HTML allowed)"
                fullWidth
                multiline
                rows={4}
                margin="normal"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <Typography variant="h6" sx={{ mt: 6, mb: 2 }}>
                Background Images ({backgroundImages.length})
            </Typography>

            <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCameraIcon />}
                sx={{ mb: 4 }}
            >
                Upload Images (you can select many)
                <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleUpload}
                />
            </Button>

            <Box
                sx={{
                    display: 'grid',
                    gap: 3,
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                }}
            >
                {backgroundImages.map((url, index) => (
                    <Box
                        key={index}
                        sx={{
                            position: 'relative',
                            borderRadius: 3,
                            overflow: 'hidden',
                            boxShadow: 4,
                        }}
                    >
                        <img
                            src={`${url}?w=600&h=400&fit=cover`}
                            alt={`Slide ${index + 1}`}
                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        />
                        <IconButton
                            color="error"
                            onClick={() => removeImage(index)}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: 'rgba(0,0,0,0.65)',
                                color: 'white',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' },
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                        <Box sx={{ p: 1.5, bgcolor: 'primary.main', color: 'white', textAlign: 'center' }}>
                            Slide {index + 1}
                        </Box>
                    </Box>
                ))}
            </Box>

            <TextField
                label="Slide Interval (milliseconds)"
                type="number"
                fullWidth
                margin="normal"
                value={carouselInterval}
                onChange={(e) => setCarouselInterval(Number(e.target.value) || 6000)}
                helperText="6000–8000 ms = cinematic feel"
                inputProps={{ min: 3000 }}
                sx={{ mt: 5 }}
            />

            <Button
                variant="contained"
                size="large"
                onClick={handleSave}
                disabled={mutation.isPending}
                sx={{ mt: 6, px: 8, py: 1.5, borderRadius: 3 }}
            >
                {mutation.isPending ? 'Saving…' : 'Save Hero Carousel'}
            </Button>
        </Paper>
    );
}