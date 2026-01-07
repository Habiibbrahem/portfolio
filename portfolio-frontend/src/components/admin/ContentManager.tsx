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
                <CircularProgress
                    size={60}
                    sx={{
                        color: '#EAB308',
                        '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                        }
                    }}
                />
            </Box>
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 4, md: 6 },
                maxWidth: 1200,
                mx: 'auto',
                borderRadius: 3,
                bgcolor: '#0F172A',
                border: '1px solid #1E293B',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
            }}
        >
            {/* Header with gradient accent bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
                <Box
                    sx={{
                        width: 4,
                        height: 40,
                        background: 'linear-gradient(180deg, #EAB308 0%, #F59E0B 100%)',
                        borderRadius: 2,
                        mr: 3
                    }}
                />
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                        color: 'white',
                        letterSpacing: '-0.5px'
                    }}
                >
                    Hero Carousel Manager
                </Typography>
            </Box>

            {success && (
                <Alert
                    severity="success"
                    sx={{
                        mb: 3,
                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                        color: '#34D399',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        '& .MuiAlert-icon': {
                            color: '#34D399'
                        }
                    }}
                >
                    {success}
                </Alert>
            )}
            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        bgcolor: 'rgba(239, 68, 68, 0.1)',
                        color: '#F87171',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        '& .MuiAlert-icon': {
                            color: '#F87171'
                        }
                    }}
                >
                    {error}
                </Alert>
            )}

            <TextField
                label="Title"
                fullWidth
                margin="normal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        bgcolor: '#1E293B',
                        color: 'white',
                        borderRadius: 2,
                        '& fieldset': {
                            borderColor: '#334155',
                        },
                        '&:hover fieldset': {
                            borderColor: '#EAB308',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#EAB308',
                            borderWidth: 2,
                        }
                    },
                    '& .MuiInputLabel-root': {
                        color: '#94A3B8',
                        fontWeight: 600,
                        '&.Mui-focused': {
                            color: '#EAB308',
                        }
                    }
                }}
            />

            <TextField
                label="Subtitle"
                fullWidth
                margin="normal"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        bgcolor: '#1E293B',
                        color: 'white',
                        borderRadius: 2,
                        '& fieldset': {
                            borderColor: '#334155',
                        },
                        '&:hover fieldset': {
                            borderColor: '#EAB308',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#EAB308',
                            borderWidth: 2,
                        }
                    },
                    '& .MuiInputLabel-root': {
                        color: '#94A3B8',
                        fontWeight: 600,
                        '&.Mui-focused': {
                            color: '#EAB308',
                        }
                    }
                }}
            />

            <TextField
                label="Content (HTML allowed)"
                fullWidth
                multiline
                rows={4}
                margin="normal"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        bgcolor: '#1E293B',
                        color: 'white',
                        borderRadius: 2,
                        '& fieldset': {
                            borderColor: '#334155',
                        },
                        '&:hover fieldset': {
                            borderColor: '#EAB308',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#EAB308',
                            borderWidth: 2,
                        }
                    },
                    '& .MuiInputLabel-root': {
                        color: '#94A3B8',
                        fontWeight: 600,
                        '&.Mui-focused': {
                            color: '#EAB308',
                        }
                    }
                }}
            />

            <Typography
                variant="h6"
                sx={{
                    mt: 6,
                    mb: 3,
                    color: '#94A3B8',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}
            >
                Background Images ({backgroundImages.length})
            </Typography>

            <Button
                variant="contained"
                component="label"
                startIcon={<PhotoCameraIcon />}
                sx={{
                    mb: 4,
                    background: 'linear-gradient(135deg, #EAB308 0%, #F59E0B 100%)',
                    color: 'white',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: '0 4px 14px 0 rgba(234, 179, 8, 0.2)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
                        boxShadow: '0 6px 20px 0 rgba(234, 179, 8, 0.3)',
                    }
                }}
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
                            borderRadius: 2,
                            overflow: 'hidden',
                            bgcolor: '#1E293B',
                            border: '1px solid #334155',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4)',
                                borderColor: '#EAB308',
                            }
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
                                bgcolor: 'rgba(0,0,0,0.75)',
                                color: 'white',
                                backdropFilter: 'blur(4px)',
                                '&:hover': {
                                    bgcolor: 'rgba(239, 68, 68, 0.9)',
                                    transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                        <Box
                            sx={{
                                p: 1.5,
                                background: 'linear-gradient(135deg, #EAB308 0%, #F59E0B 100%)',
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 600
                            }}
                        >
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
                sx={{
                    mt: 5,
                    '& .MuiOutlinedInput-root': {
                        bgcolor: '#1E293B',
                        color: 'white',
                        borderRadius: 2,
                        '& fieldset': {
                            borderColor: '#334155',
                        },
                        '&:hover fieldset': {
                            borderColor: '#EAB308',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#EAB308',
                            borderWidth: 2,
                        }
                    },
                    '& .MuiInputLabel-root': {
                        color: '#94A3B8',
                        fontWeight: 600,
                        '&.Mui-focused': {
                            color: '#EAB308',
                        }
                    },
                    '& .MuiFormHelperText-root': {
                        color: '#64748B',
                    }
                }}
            />

            <Button
                variant="contained"
                size="large"
                onClick={handleSave}
                disabled={mutation.isPending}
                sx={{
                    mt: 6,
                    px: 8,
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #EAB308 0%, #F59E0B 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: '0 8px 16px 0 rgba(234, 179, 8, 0.25)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        boxShadow: '0 12px 24px 0 rgba(234, 179, 8, 0.35)',
                        transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                        background: '#334155',
                        color: '#64748B',
                        boxShadow: 'none',
                    },
                    transition: 'all 0.3s ease',
                }}
            >
                {mutation.isPending ? 'Saving…' : 'Save Hero Carousel'}
            </Button>
        </Paper>
    );
}