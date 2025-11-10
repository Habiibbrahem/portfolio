import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function ProtectedRoute({ children }: { children?: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated === null) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                bgcolor: 'background.default'
            }}>
                <CircularProgress
                    size={60}
                    sx={{ color: 'secondary.main' }}
                />
                <Typography
                    sx={{
                        mt: 3,
                        color: 'text.secondary'
                    }}
                >
                    Verifying authentication...
                </Typography>
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
}