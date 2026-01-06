// src/pages/admin/Dashboard.tsx
import { useState } from 'react'; // ← ADDED for showAllActivities
import { Box, Typography, Grid, Paper, Stack, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';

import PublicIcon from '@mui/icons-material/Public';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import MessageIcon from '@mui/icons-material/Message';
import DashboardIcon from '@mui/icons-material/Dashboard';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArticleIcon from '@mui/icons-material/Article';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

type Stats = {
    siteVisits: number;
    activeServices: number;
    messages: { new: number };
    recentActivities: { text: string; time: string; color: 'info' | 'warning' }[];
};

export default function Dashboard() {
    const navigate = useNavigate();
    const [showAllActivities, setShowAllActivities] = useState(false);

    const { data: stats, isLoading } = useQuery<Stats>({
        queryKey: ['stats-overview'],
        queryFn: async () => api.get('/stats/overview').then(res => res.data),
    });

    const displayedActivities = showAllActivities
        ? stats?.recentActivities || []
        : (stats?.recentActivities || []).slice(0, 7);

    const statCards = [
        {
            title: 'Total Site Visits',
            value: stats?.siteVisits ?? 0,
            trend: '+12% this month',
            barColor: '#FF6B35',
            icon: <PublicIcon sx={{ fontSize: 48 }} />,
        },
        {
            title: 'Active Services',
            value: stats?.activeServices ?? 0,
            trend: 'All operational',
            barColor: '#2196F3',
            icon: <DesignServicesIcon sx={{ fontSize: 48 }} />,
        },
        {
            title: 'New Messages',
            value: stats?.messages?.new ?? 0,
            trend: 'Requires attention',
            barColor: '#F44336',
            icon: <MessageIcon sx={{ fontSize: 48 }} />,
        },
    ];

    const quickActions = [
        { icon: <DashboardIcon sx={{ fontSize: 32 }} />, label: 'Create New Project', desc: 'Add a new construction project to showcase', path: '/admin/dashboard/content' },
        { icon: <UploadFileIcon sx={{ fontSize: 32 }} />, label: 'Upload Media', desc: 'Add images and files to media library', path: '/admin/dashboard/uploads' },
        { icon: <ArticleIcon sx={{ fontSize: 32 }} />, label: 'Publish News', desc: 'Share company updates and announcements', path: '/admin/dashboard/news' },
        { icon: <DesignServicesIcon sx={{ fontSize: 32 }} />, label: 'Manage Services', desc: 'Edit your service offerings and descriptions', path: '/admin/dashboard/services' },
    ];

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome back, Admin!
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={6}>
                Manage your construction company website content and media
            </Typography>

            {/* Stat Cards */}
            <Grid container spacing={4} mb={8}>
                {statCards.map((card, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                        <Paper sx={{ p: 5, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                            <Box sx={{ position: 'absolute', top: 0, left: 0, height: 10, width: '100%', bgcolor: card.barColor }} />
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="h3" fontWeight="bold">
                                        {isLoading ? '-' : card.value.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" mt={2}>
                                        {card.title}
                                    </Typography>
                                </Box>
                                <Box sx={{ color: card.barColor, opacity: 0.8 }}>
                                    {card.icon}
                                </Box>
                            </Stack>
                            <Typography variant="body2" color={card.trend.includes('Requires') ? 'error.main' : 'success.main'} mt={4}>
                                {card.trend}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Quick Actions & Recent Activity */}
            <Grid container spacing={6}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Quick Actions
                    </Typography>
                    <Stack spacing={3} mt={4}>
                        {quickActions.map((action, i) => (
                            <Paper
                                key={i}
                                onClick={() => navigate(action.path)}
                                sx={{
                                    p: 4,
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                    transition: '0.3s',
                                    bgcolor: '#fff',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                                }}
                            >
                                <Stack direction="row" spacing={4} alignItems="center">
                                    <Box sx={{ color: 'text.secondary' }}>
                                        {action.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">
                                            {action.label}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {action.desc}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Recent Activity
                    </Typography>
                    <Paper sx={{ p: 5, borderRadius: 4, mt: 4, bgcolor: '#fff' }}>
                        <List>
                            {displayedActivities.length > 0 ? (
                                displayedActivities.map((item, i) => (
                                    <ListItem key={i} sx={{ py: 1.5 }}>
                                        <ListItemIcon sx={{ minWidth: 30 }}>
                                            <FiberManualRecordIcon sx={{ fontSize: 12, color: `${item.color}.main` }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.text}
                                            secondary={item.time}
                                            primaryTypographyProps={{ fontWeight: 'medium' }}
                                            secondaryTypographyProps={{ color: 'text.secondary' }}
                                        />
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem>
                                    <ListItemText primary="No recent activity" secondary="Actions will appear here" />
                                </ListItem>
                            )}
                        </List>
                        {(stats?.recentActivities || []).length > 7 && (
                            <Button
                                variant="text"
                                endIcon={showAllActivities ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                onClick={() => setShowAllActivities(!showAllActivities)}
                                sx={{ mt: 2, ml: 'auto', display: 'block' }}
                            >
                                {showAllActivities ? 'Show Less' : 'View All'}
                            </Button>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}