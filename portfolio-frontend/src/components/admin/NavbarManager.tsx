// src/components/admin/NavbarManager.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Button, TextField, List, ListItem, ListItemText, IconButton, Switch, Typography, Alert, CircularProgress, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getNavbar, updateNavbar } from '../../api/cms.ts';
import type { CmsSection, NavbarItem } from '../../types/cms.ts';

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
                    <Switch checked={item.published ?? true} onChange={() => onToggle(item)} />
                    <IconButton onClick={() => onEdit(item)}><EditIcon /></IconButton>
                    <IconButton onClick={() => onDelete(item.id)}><DeleteIcon /></IconButton>
                </>
            }
            sx={{
                bgcolor: 'background.paper',
                mb: 1.5,
                borderRadius: 3,
                boxShadow: 2,
                border: '1px solid #eee',
                '&:hover': { boxShadow: 6 }
            }}
        >
            <DragIndicatorIcon sx={{ mr: 2, color: 'text.disabled', cursor: 'grab' }} />
            <ListItemText
                primary={<strong>{item.label}</strong>}
                secondary={item.link}
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
            setSuccess('✅ Saved & LIVE on public site!');
            setError('');
            setTimeout(() => setSuccess(''), 4000);
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || 'Unauthorized or server error';
            setError(`❌ Save failed: ${msg}`);
            console.error('Full error:', err);
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
            setError('Label and Link required!');
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
            <Box sx={{ p: 8, textAlign: 'center' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading navbar...</Typography>
            </Box>
        );
    }

    return (
        <Paper elevation={6} sx={{ p: 6, maxWidth: 1000, mx: 'auto', borderRadius: 4 }}>
            <Typography variant="h3" gutterBottom color="#FF5722" fontWeight="bold" align="center">
                🧭 Navbar Manager
            </Typography>

            {success && <Alert severity="success" sx={{ mb: 3, fontSize: '1.1em' }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 3, fontSize: '1.1em' }}>{error}</Alert>}

            <Box sx={{ display: 'flex', gap: 2, mb: 5, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <TextField label="Label" placeholder="Home" value={label} onChange={(e) => setLabel(e.target.value)} sx={{ minWidth: 250 }} />
                <TextField label="Link" placeholder="/" value={link} onChange={(e) => setLink(e.target.value)} sx={{ minWidth: 250 }} />
                <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={handleSave}>
                    {editing ? 'UPDATE' : 'ADD ITEM'}
                </Button>
                {editing && <Button variant="outlined" onClick={() => { setEditing(null); setLabel(''); setLink(''); }}>Cancel</Button>}
            </Box>

            {items.length === 0 ? (
                <Alert severity="info">Add "Home" → "/"</Alert>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                        <List>
                            {items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map(item => (
                                <SortableItem key={item.id} item={item} onEdit={startEdit} onDelete={handleDelete} onToggle={handleToggle} />
                            ))}
                        </List>
                    </SortableContext>
                </DndContext>
            )}

            <Alert severity="success" sx={{ mt: 6 }}>
                Changes <strong>LIVE</strong> → <a href="/" target="_blank">Public Site</a>
            </Alert>
        </Paper>
    );
}