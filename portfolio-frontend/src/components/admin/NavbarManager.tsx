// src/components/admin/NavbarManager.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Switch,
    Typography,
    Alert,
    CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getNavbar, updateNavbar } from '../../api/cms';
import type { CmsSection, NavbarItem } from '../../types/cms';

function SortableItem({ item, onEdit, onDelete, onToggle }: { item: NavbarItem; onEdit: (item: NavbarItem) => void; onDelete: (id: string) => void; onToggle: (item: NavbarItem) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <ListItem
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            secondaryAction={
                <>
                    <Switch
                        checked={item.published ?? true}
                        onChange={() => onToggle(item)}
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#EAB308',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                bgcolor: '#EAB308',
                            },
                        }}
                    />
                    <IconButton onClick={() => onEdit(item)} sx={{ color: 'white' }}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDelete(item.id)} sx={{ color: '#F87171' }}>
                        <DeleteIcon />
                    </IconButton>
                </>
            }
            sx={{
                bgcolor: '#1E293B',
                mb: 2,
                borderRadius: 2,
                border: '1px solid #334155',
                '&:hover': {
                    borderColor: '#EAB308',
                    boxShadow: '0 4px 12px rgba(234, 179, 8, 0.15)',
                },
                transition: 'all 0.3s ease',
            }}
        >
            <DragIndicatorIcon sx={{ mr: 3, color: '#94A3B8', cursor: 'grab' }} />
            <ListItemText
                primary={item.label}
                secondary={item.link}
                primaryTypographyProps={{ color: 'white', fontWeight: 600 }}
                secondaryTypographyProps={{ color: '#94A3B8' }}
            />
        </ListItem>
    );
}

export default function NavbarManager() {
    const queryClient = useQueryClient();
    const [label, setLabel] = useState('');
    const [link, setLink] = useState('');
    const [editing, setEditing] = useState<NavbarItem | null>(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const { data: navbarSection, isLoading } = useQuery<CmsSection>({
        queryKey: ['navbar'],
        queryFn: getNavbar,
    });

    const items: NavbarItem[] = navbarSection?.data?.items || [];

    const mutation = useMutation({
        mutationFn: updateNavbar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['navbar'] });
            setSuccess('Navigation updated successfully');
            setTimeout(() => setSuccess(''), 4000);
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || 'Update failed';
            setError(msg);
        },
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor)
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex).map((it, idx) => ({ ...it, order: idx }));
        mutation.mutate(newItems);
    };

    const handleSave = () => {
        if (!label.trim() || !link.trim()) {
            setError('Label and link are required');
            return;
        }
        let newItems = [...items];
        if (editing) {
            newItems = newItems.map(i => i.id === editing.id ? { ...i, label: label.trim(), link: link.trim() } : i);
            setEditing(null);
        } else {
            newItems.push({
                id: Date.now().toString(),
                label: label.trim(),
                link: link.trim(),
                order: items.length,
                published: true
            });
        }
        mutation.mutate(newItems);
        setLabel('');
        setLink('');
    };

    const handleDelete = (id: string) => {
        const newItems = items.filter(i => i.id !== id).map((it, idx) => ({ ...it, order: idx }));
        mutation.mutate(newItems);
    };

    const handleToggle = (item: NavbarItem) => {
        const newItems = items.map(i => i.id === item.id ? { ...i, published: !(i.published ?? true) } : i);
        mutation.mutate(newItems);
    };

    const startEdit = (item: NavbarItem) => {
        setLabel(item.label);
        setLink(item.link);
        setEditing(item);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} sx={{ color: '#EAB308' }} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#0F172A',
                color: 'white',
                p: { xs: 3, md: 6 },
            }}
        >
            <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
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
                        Navigation Management
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

                {/* Add/Edit Form */}
                <Box sx={{ display: 'flex', gap: 2, mb: 6, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <TextField
                        label="Label"
                        placeholder="Services"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        sx={{
                            minWidth: 240,
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
                    <TextField
                        label="Link"
                        placeholder="/services"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        sx={{
                            minWidth: 240,
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
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleSave}
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
                        {editing ? 'Update Item' : 'Add Item'}
                    </Button>
                    {editing && (
                        <Button
                            variant="outlined"
                            onClick={() => { setEditing(null); setLabel(''); setLink(''); }}
                            sx={{
                                borderColor: '#334155',
                                color: '#94A3B8',
                                '&:hover': { borderColor: '#EAB308', color: '#EAB308' },
                            }}
                        >
                            Cancel
                        </Button>
                    )}
                </Box>

                {/* Navigation Items List */}
                {items.length === 0 ? (
                    <Alert
                        severity="info"
                        sx={{
                            bgcolor: 'rgba(59, 130, 246, 0.1)',
                            color: '#93C5FD',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                        }}
                    >
                        Add navigation items to get started
                    </Alert>
                ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                            <List>
                                {items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map(item => (
                                    <SortableItem
                                        key={item.id}
                                        item={item}
                                        onEdit={startEdit}
                                        onDelete={handleDelete}
                                        onToggle={handleToggle}
                                    />
                                ))}
                            </List>
                        </SortableContext>
                    </DndContext>
                )}

                <Alert
                    severity="info"
                    sx={{
                        mt: 6,
                        bgcolor: 'rgba(59, 130, 246, 0.1)',
                        color: '#93C5FD',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                    }}
                >
                    Drag to reorder items. Changes appear on the live site immediately.
                </Alert>
            </Box>
        </Box>
    );
}