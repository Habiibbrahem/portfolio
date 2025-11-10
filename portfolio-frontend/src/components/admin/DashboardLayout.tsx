import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Drawer, List, ListItemButton, ListItemIcon,
  ListItemText, IconButton, Typography, Box, Divider, CssBaseline
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NavigationIcon from '@mui/icons-material/Navigation';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '../../store/useAuthStore';

const drawerWidth = 240;

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const menuItems = [
    { text: 'Overview', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Navigation', icon: <NavigationIcon />, path: '/admin/dashboard/navbar' },
    { text: 'Content', icon: <ContentCopyIcon />, path: '/admin/dashboard/content' },
    { text: 'Media', icon: <UploadFileIcon />, path: '/admin/dashboard/uploads' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ bgcolor: 'primary.main' }}>
        <Typography variant="h6" color="white" fontWeight="bold" noWrap>
          Construct CMS
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => handleNav(item.path)}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '& .MuiListItemIcon-root': { color: 'white' },
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
        <Divider sx={{ my: 2 }} />
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 2,
            color: 'error.main',
            '&:hover': { bgcolor: 'error.light', color: 'white' },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'primary.main',
      }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap fontWeight="bold">
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}>
        {drawer}
      </Drawer>

      <Drawer variant="permanent" sx={{
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': { width: drawerWidth, position: 'fixed', height: '100vh' },
      }}>
        {drawer}
      </Drawer>

      <Box component="main" sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        minHeight: '100vh',
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}>
        <Toolbar />
        <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}