import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AppBar, Toolbar, Button, Box, Container } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { getNavbar } from '../../api/cms';
import type { NavbarItem } from '../../types/cms';

export default function PublicNavbar() {
    const queryClient = useQueryClient();
    const location = useLocation();

    const { data: navbarSection } = useQuery({
        queryKey: ['navbar'],
        queryFn: getNavbar,
        refetchInterval: 3000,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['navbar'] }),
    });

    const items: NavbarItem[] = navbarSection?.data?.items || [];
    const publishedItems = items
        .filter(i => i.published !== false)
        .sort((a, b) => a.order - b.order);

    if (publishedItems.length === 0) return null;

    return (
        <AppBar
            position="fixed"
            sx={{
                bgcolor: 'background.paper',
                boxShadow: 1,
                backdropFilter: 'blur(10px)',
            }}
        >
            <Container maxWidth="lg">
                <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                            component={Link}
                            to="/"
                            sx={{
                                textDecoration: 'none',
                                color: 'primary.main',
                                fontWeight: 700,
                                fontSize: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <Box
                                sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: 'secondary.main',
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                C
                            </Box>
                            CONSTRUCT
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {publishedItems.map(item => (
                            <Button
                                key={item.id}
                                component={Link}
                                to={item.link}
                                sx={{
                                    fontWeight: location.pathname === item.link ? 700 : 500,
                                    color: location.pathname === item.link ? 'secondary.main' : 'text.primary',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    px: 2,
                                    borderRadius: 2,
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    }
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}