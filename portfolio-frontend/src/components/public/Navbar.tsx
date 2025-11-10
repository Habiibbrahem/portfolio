// src/components/public/Navbar.tsx
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { getNavbar } from '../../api/cms.ts';
import type { NavbarItem } from '../../types/cms.ts';

export default function PublicNavbar() {
    const queryClient = useQueryClient();
    const { data: navbarSection } = useQuery({
        queryKey: ['navbar'],
        queryFn: getNavbar,
        refetchInterval: 3000, // LIVE REFRESH
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['navbar'] }),
    });

    const items: NavbarItem[] = navbarSection?.data?.items || [];
    const publishedItems = items
        .filter(i => i.published !== false)
        .sort((a, b) => a.order - b.order);

    if (publishedItems.length === 0) return null;

    return (
        <AppBar position="sticky" sx={{ bgcolor: '#FF5722', mb: 4 }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    🏗️ Construction Co.
                </Typography>
                <Box sx={{ display: 'flex', gap: 3 }}>
                    {publishedItems.map(item => (
                        <Button key={item.id} color="inherit" component={Link} to={item.link} sx={{ fontWeight: 600, textTransform: 'none', fontSize: '1.1em' }}>
                            {item.label}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
}