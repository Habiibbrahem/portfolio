import {
    AppBar,
    Toolbar,
    Box,
    Container,
    IconButton,
    Button,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '../../store/useAuthStore';

const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' },
];

export default function PublicNavbar() {
    const location = useLocation();

    const { isAuthenticated, hydrated, logout } = useAuthStore();

    // ⛔ Prevent rendering until auth state is fully restored
    if (!hydrated) return null;

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                bgcolor: 'background.paper',
                boxShadow: 1,
                backdropFilter: 'blur(10px)',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Container maxWidth="lg">
                <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                    {/* LOGO */}
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
                            gap: 1,
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
                                fontWeight: 'bold',
                            }}
                        >
                            C
                        </Box>
                        CONSTRUCT
                    </Box>

                    {/* NAV LINKS + AUTH ACTIONS */}
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                        {navLinks.map((link) => (
                            <Button
                                key={link.path}
                                component={Link}
                                to={link.path}
                                sx={{
                                    fontWeight:
                                        location.pathname === link.path
                                            ? 700
                                            : 500,
                                    color:
                                        location.pathname === link.path
                                            ? 'secondary.main'
                                            : 'text.primary',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    px: 2,
                                    borderRadius: 2,
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    },
                                }}
                            >
                                {link.label}
                            </Button>
                        ))}

                        {/* AUTH CONTROLS */}
                        {isAuthenticated ? (
                            <>
                                <Button
                                    component={Link}
                                    to="/admin/dashboard"
                                    startIcon={<DashboardIcon />}
                                    sx={{
                                        fontWeight: 600,
                                        color: 'primary.main',
                                        textTransform: 'none',
                                        bgcolor: 'action.hover',
                                        '&:hover': {
                                            bgcolor: 'primary.light',
                                            color: 'white',
                                        },
                                    }}
                                >
                                    Dashboard
                                </Button>

                                <Button
                                    onClick={handleLogout}
                                    startIcon={<LogoutIcon />}
                                    sx={{
                                        fontWeight: 600,
                                        color: 'error.main',
                                        textTransform: 'none',
                                        '&:hover': {
                                            bgcolor: 'error.light',
                                            color: 'white',
                                        },
                                    }}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <IconButton
                                component={Link}
                                to="/admin/login"
                                aria-label="Admin login"
                                sx={{
                                    ml: 2,
                                    color: 'text.secondary',
                                    bgcolor: 'action.hover',
                                    '&:hover': {
                                        bgcolor: 'secondary.main',
                                        color: 'black',
                                    },
                                    transition: 'all 0.2s',
                                }}
                            >
                                <LockIcon />
                            </IconButton>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
