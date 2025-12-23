// src/components/admin/MessagesManager.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Typography,
    Paper,
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
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
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

    const { data: messages = [], isLoading: loadingMessages } = useQuery<Message[]>({
        queryKey: ['messages'],
        queryFn: getMessages,
    });

    const { data: unreadCount = 0, isLoading: loadingCount } = useQuery<number>({
        queryKey: ['unread-count'],
        queryFn: getUnreadCount,
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    const mutation = useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            queryClient.invalidateQueries({ queryKey: ['unread-count'] });
        },
    });

    if (loadingMessages) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper elevation={4} sx={{ p: { xs: 4, md: 6 }, borderRadius: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Badge badgeContent={unreadCount} color="error">
                    <MailOutlineIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Badge>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                    Contact Messages ({messages.length} total, {unreadCount} unread)
                </Typography>
            </Box>

            {messages.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 8 }}>
                    No messages yet.
                </Typography>
            ) : (
                <TableContainer component={Paper} elevation={2}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Date</strong></TableCell>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Phone</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Message</strong></TableCell>
                                <TableCell><strong>Action</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {messages.map((msg) => (
                                <TableRow key={msg._id} hover sx={{ bgcolor: msg.read ? 'inherit' : 'action.hover' }}>
                                    <TableCell>{new Date(msg.createdAt).toLocaleString()}</TableCell>
                                    <TableCell>{msg.name}</TableCell>
                                    <TableCell>{msg.email}</TableCell>
                                    <TableCell>{msg.phone || '-'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={msg.read ? 'Read' : 'Unread'}
                                            color={msg.read ? 'default' : 'error'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 400, whiteSpace: 'pre-wrap' }}>{msg.message}</TableCell>
                                    <TableCell>
                                        {!msg.read && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => mutation.mutate(msg._id)}
                                                disabled={mutation.isPending}
                                            >
                                                Mark as Read
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
}