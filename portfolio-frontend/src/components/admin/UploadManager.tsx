// src/components/admin/UploadManager.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Button,
    Typography,
    Alert,
    Grid,
    Card,
    CardMedia,
    CardActions,
    IconButton,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import { uploadImage, deleteImage } from '../../api/upload';
import api from '../../api/client';

export default function UploadManager() {
    const queryClient = useQueryClient();
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const { data: images = [], isLoading, refetch } = useQuery({
        queryKey: ['uploads'],
        queryFn: async () => {
            const { data } = await api.get('/upload');
            return data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteImage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['uploads'] });
            showMessage('Image deleted successfully', 'success');
        },
        onError: () => showMessage('Failed to delete image', 'error'),
    });

    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            await uploadImage(file);
            queryClient.invalidateQueries({ queryKey: ['uploads'] });
            showMessage('Upload successful!', 'success');
        } catch {
            showMessage('Upload failed', 'error');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showMessage('URL copied!', 'success');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#0F172A',
                color: 'white',
                p: { xs: 3, md: 6 },
            }}
        >
            <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
                {/* Title with gold accent line */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
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
                        Media Management
                    </Typography>
                </Box>

                {/* Top Controls */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
                    <Box />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={() => refetch()}
                            sx={{
                                borderColor: '#334155',
                                color: '#94A3B8',
                                '&:hover': {
                                    borderColor: '#EAB308',
                                    color: '#EAB308',
                                    bgcolor: 'rgba(234, 179, 8, 0.1)',
                                },
                            }}
                        >
                            Refresh
                        </Button>

                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<PhotoCameraIcon />}
                            sx={{
                                background: 'linear-gradient(135deg, #EAB308 0%, #F59E0B 100%)',
                                color: 'white',
                                fontWeight: 600,
                                boxShadow: '0 4px 14px 0 rgba(234, 179, 8, 0.2)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
                                    boxShadow: '0 6px 20px 0 rgba(234, 179, 8, 0.3)',
                                },
                            }}
                        >
                            Upload New Image
                            <input type="file" hidden accept="image/*" onChange={handleUpload} />
                        </Button>
                    </Box>
                </Box>

                {message && (
                    <Alert
                        severity={message.type}
                        sx={{
                            mb: 4,
                            bgcolor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: message.type === 'success' ? '#34D399' : '#F87171',
                            border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                            '& .MuiAlert-icon': {
                                color: message.type === 'success' ? '#34D399' : '#F87171'
                            }
                        }}
                    >
                        {message.text}
                    </Alert>
                )}

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                        <CircularProgress size={60} sx={{ color: '#EAB308' }} />
                    </Box>
                ) : images.length === 0 ? (
                    <Alert
                        severity="info"
                        sx={{
                            bgcolor: 'rgba(59, 130, 246, 0.1)',
                            color: '#93C5FD',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                        }}
                    >
                        No images uploaded yet. Start uploading!
                    </Alert>
                ) : (
                    <Grid container spacing={4}>
                        {images.map((img: any) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={img.public_id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        bgcolor: '#1E293B',
                                        borderRadius: 2,
                                        border: '1px solid #334155',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: '#EAB308',
                                            boxShadow: '0 12px 32px rgba(234, 179, 8, 0.2)',
                                            transform: 'translateY(-4px)',
                                        },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={`${img.url}?w=600&h=400&fit=cover`}
                                        alt={img.originalName}
                                        sx={{ height: 220, objectFit: 'cover' }}
                                    />
                                    <CardActions sx={{ mt: 'auto', justifyContent: 'space-between', p: 2 }}>
                                        <Tooltip title="Copy URL">
                                            <IconButton
                                                onClick={() => copyToClipboard(img.url)}
                                                sx={{
                                                    color: '#94A3B8',
                                                    '&:hover': { color: '#EAB308', bgcolor: 'rgba(234, 179, 8, 0.1)' },
                                                }}
                                            >
                                                <ContentCopyIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                onClick={() => deleteMutation.mutate(img.public_id)}
                                                sx={{
                                                    color: '#F87171',
                                                    '&:hover': { color: '#EF4444', bgcolor: 'rgba(239, 68, 68, 0.1)' },
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </CardActions>
                                    <Box sx={{ p: 2, pt: 0 }}>
                                        <Typography variant="body2" noWrap sx={{ color: 'white' }}>
                                            {img.originalName}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                                            {new Date(img.uploadedAt).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Box>
    );
}