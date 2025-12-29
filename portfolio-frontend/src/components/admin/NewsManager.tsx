import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    Paper,
    CircularProgress,
    Grid,
    IconButton,
    Card,
    CardMedia,
    CardContent,
} from '@mui/material';
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
import type { DragEndEvent } from '@dnd-kit/sortable'; // ← NEW: Import type here
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
    image: string;
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
        <Card ref={setNodeRef} style={style} sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
            <IconButton {...attributes} {...listeners} sx={{ cursor: 'grab' }}>
                <DragHandleIcon />
            </IconButton>
            {item.image ? (
                <CardMedia
                    component="img"
                    sx={{ width: 100, height: 100, objectFit: 'cover' }}
                    image={`${item.image}?w=200&h=200&fit=crop`}
                    alt={item.title}
                />
            ) : (
                <Box sx={{ width: 100, height: 100, bgcolor: 'grey.300', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AddPhotoAlternateIcon fontSize="large" color="disabled" />
                </Box>
            )}
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1">{item.title || 'Untitled News'}</Typography>
            </CardContent>
            <IconButton color="error" onClick={() => onRemove(item.id)}>
                <DeleteIcon />
            </IconButton>
        </Card>
    );
}

export default function NewsManager() {
    const queryClient = useQueryClient();
    const [items, setItems] = useState<NewsItem[]>([]);
    const [newTitle, setNewTitle] = useState('');
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
    });

    useEffect(() => {
        if (newsSection?.data?.items) {
            setItems(
                newsSection.data.items.map((item: any) => ({
                    id: item.id || Math.random().toString(36).substr(2, 9),
                    title: item.title || '',
                    image: item.image || '',
                }))
            );
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
        if (!newTitle.trim()) return;
        const newItem: NewsItem = {
            id: Math.random().toString(36).substr(2, 9),
            title: newTitle.trim(),
            image: '',
        };
        setItems([...items, newItem]);
        setNewTitle('');
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
        setItems(items.filter(i => i.id !== id));
    };

    const handleSave = () => {
        mutation.mutate(items);
    };

    if (isLoading) return <CircularProgress />;

    return (
        <Paper elevation={4} sx={{ p: { xs: 4, md: 6 }, maxWidth: 1000, mx: 'auto', borderRadius: 4 }}>
            <Typography variant="h4" fontWeight="bold" color="primary" mb={5}>
                News Manager
            </Typography>

            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={8}>
                    <TextField
                        label="New News Title"
                        fullWidth
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addNewsItem()}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={addNewsItem}
                        disabled={!newTitle.trim()}
                        sx={{ height: 56 }}
                    >
                        Add News
                    </Button>
                </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mb: 3 }}>
                Current News Items ({items.length})
            </Typography>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    {items.map((item) => (
                        <SortableItem key={item.id} item={item} onRemove={removeItem} />
                    ))}
                </SortableContext>
            </DndContext>

            {/* Image upload per item */}
            {items.map((item) => !item.image && (
                <Box key={`upload-${item.id}`} sx={{ mt: 2 }}>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<AddPhotoAlternateIcon />}
                        disabled={uploading}
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
                sx={{ mt: 6, px: 8, py: 1.5 }}
            >
                {mutation.isPending ? 'Saving...' : 'Save News Section'}
            </Button>
        </Paper>
    );
}