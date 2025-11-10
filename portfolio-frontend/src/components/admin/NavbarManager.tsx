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
                    <Switch checked={item.published ?? true} onChange={() => onToggle(item)} />
                    <IconButton onClick={() => onEdit(item)}><EditIcon /></IconButton>
                    <IconButton onClick={() => onDelete(item.id)}><DeleteIcon /></IconButton>
                </>
            }
            sx={{
                bgcolor: 'background.paper',
                mb: 1,
                borderRadius: 2,
                boxShadow: 1,
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <DragIndicatorIcon sx={{ mr: 2, color: 'text.secondary' }} />
            <ListItemText
                primary={item.label}
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
            setSuccess('Navigation updated successfully');
            setError('');
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
            <Box sx={{ p: 8, textAlign: 'center' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading navigation...</Typography>
            </Box>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 1000, mx: 'auto', borderRadius: 3 }}>
            <Typography variant="h4" gutterBottom color="primary.main" fontWeight="bold">
                Navigation Management
            </Typography>

            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <TextField
                    label="Label"
                    placeholder="Services"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    sx={{ minWidth: 200 }}
                />
                <TextField
                    label="Link"
                    placeholder="/services"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    sx={{ minWidth: 200 }}
                />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleSave}
                >
                    {editing ? 'Update' : 'Add Item'}
                </Button>
                {editing && (
                    <Button
                        variant="outlined"
                        onClick={() => { setEditing(null); setLabel(''); setLink(''); }}
                    >
                        Cancel
                    </Button>
                )}
            </Box>

            {items.length === 0 ? (
                <Alert severity="info">Add navigation items to get started</Alert>
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

            <Alert severity="info" sx={{ mt: 4 }}>
                Drag to reorder items. Changes appear on the live site immediately.
            </Alert>
        </Paper>
    );
}