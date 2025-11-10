// src/components/admin/DashboardLayout.tsx
import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Divider,
  CssBaseline,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NavigationIcon from '@mui/icons-material/Navigation';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import UploadIcon from '@mui/icons-material/UploadFile';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '../../store/useAuthStore.ts';

const drawerWidth = 260;

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const menuItems = [
    { text: 'Overview', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Manage Navbar', icon: <NavigationIcon />, path: '/admin/dashboard/navbar' },
    { text: 'Manage Content', icon: <ContentCopyIcon />, path: '/admin/dashboard/content' },
    { text: 'Media Uploads', icon: <UploadIcon />, path: '/admin/dashboard/uploads' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ background: '#FF5722', minHeight: '64px !important' }}>
        <Typography variant="h6" color="white" fontWeight="bold" noWrap>
          CONSTRUCTION CMS
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            selected={
              location.pathname === item.path ||
              (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path))
            }
            onClick={() => handleNav(item.path)}
            sx={{
              borderRadius: 3,
              mb: 0.5,
              '&.Mui-selected': {
                background: 'linear-gradient(45deg, #FF5722, #FF8A65)',
                color: 'white',
                '& .MuiListItemIcon-root': { color: 'white' },
                '&:hover': { background: '#e64a19' },
              },
              '&:hover': { background: '#fff3e0' },
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname.startsWith(item.path) ? '#FF5722' : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 'medium' }} />
          </ListItemButton>
        ))}
        <Divider sx={{ my: 3 }} />
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 3,
            '&:hover': { background: '#ffebee' },
          }}
        >
          <ListItemIcon sx={{ color: '#d32f2f' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: '#d32f2f', fontWeight: 'medium' }} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* TOP APPBAR */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#FF5722',
          boxShadow: '0 4px 20px rgba(255,87,34,0.3)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap fontWeight="bold">
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            bgcolor: '#fff',
            boxShadow: '10px 0 30px rgba(0,0,0,0.1)',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* DESKTOP DRAWER – PERMANENT */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            bgcolor: '#ffffff',
            borderRight: '1px solid #eee',
            boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* MAIN CONTENT AREA */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f5f5f5',
          minHeight: '100vh',
          transition: 'margin 0.3s ease',
        }}
      >
        <Toolbar /> {/* SPACER FOR APPBAR */}
        <Box
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            py: 3,
            maxWidth: '1600px',
            mx: 'auto',
            width: '100%',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}