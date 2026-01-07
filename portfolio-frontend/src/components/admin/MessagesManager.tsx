// src/components/admin/MessagesManager.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    CircularProgress,
    Badge,
    IconButton,
    Collapse,
    Tooltip,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import api from '../../api/client';

interface Message {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt: string;
    read: boolean;
}

const getMessages = async (): Promise<Message[]> => {
    const { data } = await api.get('/contact-messages');
    return data;
};

const getUnreadCount = async (): Promise<number> => {
    const { data } = await api.get('/contact-messages/unread-count');
    return data.count;
};

const markAsRead = async (id: string) => {
    await api.patch(`/contact-messages/${id}/read`);
};

export default function MessagesManager() {
    const queryClient = useQueryClient();
    const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

    const { data: messages = [], isLoading: loadingMessages } = useQuery<Message[]>({
        queryKey: ['messages'],
        queryFn: getMessages,
    });

    const { data: unreadCount = 0 } = useQuery<number>({
        queryKey: ['unread-count'],
        queryFn: getUnreadCount,
        refetchInterval: 30000,
    });

    const mutation = useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            queryClient.invalidateQueries({ queryKey: ['unread-count'] });
        },
    });

    const toggleExpand = (id: string) => {
        setExpandedMessages((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const truncateMessage = (msg: string) => {
        if (msg.length <= 200) return msg;
        return msg.substring(0, 200) + '...';
    };

    if (loadingMessages) {
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
                    <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { bgcolor: '#EF4444' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <MailOutlineIcon sx={{ fontSize: 40, color: '#EAB308' }} />
                            <Typography
                                variant="h4"
                                fontWeight="bold"
                                sx={{
                                    color: 'white',
                                    letterSpacing: '-0.5px'
                                }}
                            >
                                Contact Messages ({messages.length} total, {unreadCount} unread)
                            </Typography>
                        </Box>
                    </Badge>
                </Box>

                {messages.length === 0 ? (
                    <Typography sx={{ color: '#64748B', textAlign: 'center', py: 12, fontSize: '1.2rem' }}>
                        No messages yet.
                    </Typography>
                ) : (
                    <TableContainer
                        sx={{
                            bgcolor: '#1E293B',
                            borderRadius: 3,
                            border: '1px solid #334155',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Date</TableCell>
                                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Name</TableCell>
                                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Email</TableCell>
                                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Phone</TableCell>
                                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Status</TableCell>
                                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Message</TableCell>
                                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {messages.map((msg) => {
                                    const isExpanded = expandedMessages.has(msg._id);
                                    const isLong = msg.message.length > 200;

                                    return (
                                        <TableRow
                                            key={msg._id}
                                            hover
                                            sx={{
                                                bgcolor: msg.read ? 'transparent' : 'rgba(234, 179, 8, 0.05)',
                                                '&:hover': { bgcolor: 'rgba(234, 179, 8, 0.1)' },
                                            }}
                                        >
                                            <TableCell sx={{ color: '#CBD5E1' }}>
                                                {new Date(msg.createdAt).toLocaleString()}
                                            </TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 500 }}>{msg.name}</TableCell>
                                            <TableCell sx={{ color: '#CBD5E1' }}>{msg.email}</TableCell>
                                            <TableCell sx={{ color: '#CBD5E1' }}>{msg.phone || '-'}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={msg.read ? 'Read' : 'Unread'}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: msg.read ? '#334155' : '#EF4444',
                                                        color: 'white',
                                                        fontWeight: 600,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: 500 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography sx={{ color: '#CBD5E1', wordBreak: 'break-word' }}>
                                                        {isLong && !isExpanded ? truncateMessage(msg.message) : msg.message}
                                                    </Typography>
                                                    {isLong && (
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => toggleExpand(msg._id)}
                                                            sx={{ color: '#EAB308' }}
                                                        >
                                                            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                        </IconButton>
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {!msg.read && (
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        onClick={() => mutation.mutate(msg._id)}
                                                        disabled={mutation.isPending}
                                                        sx={{
                                                            background: 'linear-gradient(135deg, #EAB308 0%, #F59E0B 100%)',
                                                            color: 'white',
                                                            fontWeight: 600,
                                                            textTransform: 'none',
                                                            '&:hover': {
                                                                background: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
                                                            },
                                                        }}
                                                    >
                                                        Mark as Read
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Box>
    );
}