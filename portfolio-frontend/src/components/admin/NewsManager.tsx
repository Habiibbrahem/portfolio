// src/components/admin/NewsManager.tsx
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    CircularProgress,
    Grid,
    IconButton,
    Card,
    CardMedia,
    CardContent,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/sortable';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import api from '../../api/client';
import { uploadImage } from '../../api/upload';
import type { CmsSection } from '../../types/cms';

interface NewsItem {
    id: string;
    title: string;
    description: string;
    image: string;
    date: string;
}

const defaultNewsData = { items: [] };

const fetchNews = async (): Promise<CmsSection> => {
    try {
        const { data } = await api.get('/cms/news');
        return data;
    } catch (err: any) {
        if (err.response?.status === 404) {
            const { data } = await api.post('/cms', {
                section: 'news',
                data: defaultNewsData,
                published: true,
            });
            return data;
        }
        throw err;
    }
};

const updateNews = async (items: NewsItem[]) => {
    const { data } = await api.patch('/cms/news', { data: { items } });
    return data;
};

function SortableItem(props: { item: NewsItem; onRemove: (id: string) => void }) {
    const { item, onRemove } = props;
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            sx={{
                display: 'flex',
                mb: 3,
                alignItems: 'center',
                bgcolor: '#1E293B',
                borderRadius: 2,
                border: '1px solid #334155',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    borderColor: '#EAB308',
                    boxShadow: '0 8px 24px rgba(234,179,8,0.15)',
                },
            }}
        >
            <IconButton {...attributes} {...listeners} sx={{ cursor: 'grab', color: '#94A3B8' }}>
                <DragHandleIcon />
            </IconButton>
            {item.image ? (
                <CardMedia
                    component="img"
                    sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: '8px 0 0 8px' }}
                    image={`${item.image}?w=240&h=240&fit=crop`}
                    alt={item.title}
                />
            ) : (
                <Box
                    sx={{
                        width: 120,
                        height: 120,
                        bgcolor: '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px 0 0 8px',
                    }}
                >
                    <AddPhotoAlternateIcon fontSize="large" sx={{ color: '#64748B' }} />
                </Box>
            )}
            <CardContent sx={{ flexGrow: 1, py: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    {item.title || 'Untitled News'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.5 }}>
                    {dayjs(item.date).format('MMMM D, YYYY')}
                </Typography>
                {item.description && (
                    <Typography variant="body2" sx={{ color: '#CBD5E1', mt: 1.5, lineHeight: 1.6 }}>
                        {item.description.substring(0, 120)}{item.description.length > 120 ? '...' : ''}
                    </Typography>
                )}
            </CardContent>
            <IconButton
                color="error"
                onClick={() => onRemove(item.id)}
                sx={{
                    mr: 2,
                    bgcolor: 'rgba(239,68,68,0.1)',
                    color: '#F87171',
                    '&:hover': { bgcolor: 'rgba(239,68,68,0.2)' },
                }}
            >
                <DeleteIcon />
            </IconButton>
        </Card>
    );
}

export default function NewsManager() {
    const queryClient = useQueryClient();
    const [items, setItems] = useState<NewsItem[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newDate, setNewDate] = useState(dayjs());
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const { data: newsSection, isLoading } = useQuery<CmsSection>({
        queryKey: ['news'],
        queryFn: fetchNews,
    });

    const mutation = useMutation({
        mutationFn: updateNews,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['news'] });
            setSuccess('News updated successfully!');
            setTimeout(() => setSuccess(''), 4000);
        },
        onError: () => {
            setError('Save failed');
            setTimeout(() => setError(''), 5000);
        },
    });

    useEffect(() => {
        if (newsSection?.data?.items) {
            const loadedItems = newsSection.data.items.map((item: any) => ({
                id: item.id || Math.random().toString(36).substr(2, 9),
                title: item.title || '',
                description: item.description || '',
                image: item.image || '',
                date: item.date || dayjs().toISOString(),
            }));
            loadedItems.sort((a: NewsItem, b: NewsItem) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setItems(loadedItems);
        }
    }, [newsSection]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const addNewsItem = () => {
        if (!newTitle.trim()) {
            setError('Title is required');
            return;
        }
        const newItem: NewsItem = {
            id: Math.random().toString(36).substr(2, 9),
            title: newTitle.trim(),
            description: newDescription.trim(),
            image: '',
            date: newDate.toISOString(),
        };
        setItems([newItem, ...items]);
        setNewTitle('');
        setNewDescription('');
        setNewDate(dayjs());

        // Log activity
        api.post('/activity/log', {
            text: `Added new news: ${newTitle.trim()}`,
            type: 'news_add',
        }).catch(() => { });
    };

    const uploadImageForItem = async (file: File, itemId: string) => {
        setUploading(true);
        try {
            const url = await uploadImage(file);
            setItems(items.map(item => item.id === itemId ? { ...item, image: url } : item));
            setSuccess('Image uploaded!');
        } catch (err) {
            setError('Upload failed');
        }
        setUploading(false);
    };

    const removeItem = (id: string) => {
        const deletedItem = items.find(i => i.id === id);
        setItems(items.filter(i => i.id !== id));

        // Log activity
        api.post('/activity/log', {
            text: `Deleted news: ${deletedItem?.title || 'Untitled'}`,
            type: 'news_delete',
        }).catch(() => { });
    };

    const handleSave = () => {
        mutation.mutate(items);

        // Log activity
        api.post('/activity/log', {
            text: `Updated news section (${items.length} items)`,
            type: 'news_update',
        }).catch(() => { });
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} sx={{ color: '#EAB308' }} />
            </Box>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: '#0F172A',
                    color: 'white',
                    p: { xs: 3, md: 6 },
                }}
            >
                <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
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
                            News Manager
                        </Typography>
                    </Box>

                    {success && (
                        <Alert
                            severity="success"
                            sx={{
                                mb: 4,
                                bgcolor: 'rgba(16, 185, 129, 0.1)',
                                color: '#34D399',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                '& .MuiAlert-icon': { color: '#34D399' }
                            }}
                        >
                            {success}
                        </Alert>
                    )}
                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 4,
                                bgcolor: 'rgba(239, 68, 68, 0.1)',
                                color: '#F87171',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                '& .MuiAlert-icon': { color: '#F87171' }
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    {/* Add News Form */}
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        <Grid item xs={12} sm={5}>
                            <TextField
                                label="News Title"
                                fullWidth
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: '#1E293B',
                                        color: 'white',
                                        borderRadius: 2,
                                        '& fieldset': { borderColor: '#334155' },
                                        '&:hover fieldset': { borderColor: '#EAB308' },
                                        '&.Mui-focused fieldset': { borderColor: '#EAB308', borderWidth: 2 },
                                    },
                                    '& .MuiInputLabel-root': { color: '#94A3B8', fontWeight: 600, '&.Mui-focused': { color: '#EAB308' } },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <DatePicker
                                label="News Date"
                                value={newDate}
                                onChange={(newValue) => newValue && setNewDate(newValue)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        sx: {
                                            '& .MuiOutlinedInput-root': {
                                                bgcolor: '#1E293B',
                                                color: 'white',
                                                borderRadius: 2,
                                                '& fieldset': { borderColor: '#334155' },
                                                '&:hover fieldset': { borderColor: '#EAB308' },
                                                '&.Mui-focused fieldset': { borderColor: '#EAB308', borderWidth: 2 },
                                            },
                                            '& .MuiInputLabel-root': { color: '#94A3B8', fontWeight: 600, '&.Mui-focused': { color: '#EAB308' } },
                                        },
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={addNewsItem}
                                disabled={!newTitle.trim()}
                                sx={{
                                    height: 56,
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
                                Add News
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={4}
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                placeholder="Full news description (shown in modal)"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: '#1E293B',
                                        color: 'white',
                                        borderRadius: 2,
                                        '& fieldset': { borderColor: '#334155' },
                                        '&:hover fieldset': { borderColor: '#EAB308' },
                                        '&.Mui-focused fieldset': { borderColor: '#EAB308', borderWidth: 2 },
                                    },
                                    '& .MuiInputLabel-root': { color: '#94A3B8', fontWeight: 600, '&.Mui-focused': { color: '#EAB308' } },
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Typography
                        variant="h6"
                        sx={{
                            mb: 3,
                            color: '#94A3B8',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Current News Items ({items.length})
                    </Typography>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                            {items.map((item) => (
                                <SortableItem key={item.id} item={item} onRemove={removeItem} />
                            ))}
                        </SortableContext>
                    </DndContext>

                    {items.map((item) => !item.image && (
                        <Box key={`upload-${item.id}`} sx={{ mt: 3, mb: 4 }}>
                            <Button
                                variant="contained"
                                component="label"
                                startIcon={<AddPhotoAlternateIcon />}
                                disabled={uploading}
                                sx={{
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
                                    },
                                }}
                            >
                                Upload Image for "{item.title}"
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => e.target.files?.[0] && uploadImageForItem(e.target.files[0], item.id)}
                                />
                            </Button>
                        </Box>
                    ))}

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSave}
                        disabled={mutation.isPending || uploading}
                        sx={{
                            mt: 6,
                            px: 8,
                            py: 2,
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
                        {mutation.isPending ? 'Saving...' : 'Save All News'}
                    </Button>
                </Box>
            </Box>
        </LocalizationProvider>
    );
}