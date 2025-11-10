import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box, Button, Typography, Alert, Paper, Grid, Card,
    CardMedia, CardActions, IconButton, CircularProgress, Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
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
        <Paper elevation={3} sx={{ p: 4, maxWidth: 1400, mx: 'auto', borderRadius: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                    Media Management
                </Typography>
                <Box>
                    <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => refetch()} sx={{ mr: 2 }}>
                        Refresh
                    </Button>
                    <Button variant="contained" component="label">
                        Upload New Image
                        <input type="file" hidden accept="image/*" onChange={handleUpload} />
                    </Button>
                </Box>
            </Box>

            {message && <Alert severity={message.type} sx={{ mb: 3 }}>{message.text}</Alert>}

            {isLoading ? (
                <Box textAlign="center" py={8}><CircularProgress /></Box>
            ) : images.length === 0 ? (
                <Alert severity="info">No images uploaded yet. Start uploading!</Alert>
            ) : (
                <Grid container spacing={3}>
                    {images.map((img: any) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={img.public_id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="img"
                                    image={`${img.url}?w=400&h=300&fit=crop`}
                                    alt={img.originalName}
                                    sx={{ height: 200, objectFit: 'cover' }}
                                />
                                <CardActions sx={{ mt: 'auto', justifyContent: 'space-between' }}>
                                    <Tooltip title="Copy URL">
                                        <IconButton onClick={() => copyToClipboard(img.url)}>
                                            <ContentCopyIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton
                                            onClick={() => deleteMutation.mutate(img.public_id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </CardActions>
                                <Box p={2} pb={1}>
                                    <Typography variant="caption" display="block" noWrap>
                                        {img.originalName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(img.uploadedAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Paper>
    );
}