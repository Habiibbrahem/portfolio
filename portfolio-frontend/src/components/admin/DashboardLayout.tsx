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
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Tooltip, // ← ADDED THIS
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NavigationIcon from '@mui/icons-material/Navigation';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import MessageIcon from '@mui/icons-material/Message';
import ShareIcon from '@mui/icons-material/Share';
import ArticleIcon from '@mui/icons-material/Article';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircle from '@mui/icons-material/AccountCircle';

import { useAuthStore } from '../../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';

const drawerWidth = 260;

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unread-messages-count'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/contact-messages/unread-count');
        return data.count;
      } catch {
        return 0;
      }
    },
    refetchInterval: 30000,
  });

  const menuItems = [
    { text: 'Overview', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Navigation', icon: <NavigationIcon />, path: '/admin/dashboard/navbar' },
    { text: 'Content', icon: <ContentCopyIcon />, path: '/admin/dashboard/content' },
    { text: 'News', icon: <ArticleIcon />, path: '/admin/dashboard/news' },
    { text: 'Social Media', icon: <ShareIcon />, path: '/admin/dashboard/social' },
    { text: 'Media', icon: <UploadFileIcon />, path: '/admin/dashboard/uploads' },
    { text: 'Services', icon: <DesignServicesIcon />, path: '/admin/dashboard/services' },
    { text: 'Contact', icon: <ContactPhoneIcon />, path: '/admin/dashboard/contact' },
    {
      text: 'Messages',
      icon: <Badge badgeContent={unreadCount} color="error"><MessageIcon /></Badge>,
      path: '/admin/dashboard/messages',
    },
    { text: 'Settings', icon: <SettingsIcon />, path: '/admin/dashboard/settings' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ bgcolor: '#1a1f2e', justifyContent: 'center' }}>
        <Typography variant="h6" color="white" fontWeight="bold">
          Construct CMS
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => handleNav(item.path)}
            sx={{
              borderRadius: 3,
              mb: 1,
              py: 1.5,
              '&.Mui-selected': {
                bgcolor: '#FF6B35',
                color: 'white',
                '& .MuiListItemIcon-root': { color: 'white' },
                '&:hover': { bgcolor: '#e55a30' },
              },
              '&:hover': {
                bgcolor: 'rgba(255, 107, 53, 0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'white' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List sx={{ px: 2, pb: 2 }}>
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 3,
            color: '#f44336',
            '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1)' },
          }}
        >
          <ListItemIcon sx={{ color: '#f44336' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <CssBaseline />

      {/* Light Top Bar */}
      <AppBar position="fixed" sx={{ bgcolor: '#f8f9fa', color: 'text.primary', boxShadow: 1, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Tooltip title="View Homepage">
            <IconButton onClick={() => navigate('/')} color="primary">
              <HomeIcon />
            </IconButton>
          </Tooltip>
          <IconButton onClick={handleMenu} sx={{ ml: 2 }}>
            <Avatar sx={{ bgcolor: '#FF6B35' }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem disabled>Admin User</MenuItem>
            <Divider />
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Permanent Dark Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, bgcolor: '#1a1f2e', color: 'white', borderRight: 'none' },
          display: { xs: 'none', md: 'block' },
        }}
      >
        {drawer}
      </Drawer>

      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, bgcolor: '#1a1f2e', color: 'white' },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f7fa', ml: { md: `${drawerWidth}px` } }}>
        <Toolbar /> {/* Spacer */}
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <Outlet />
        </Box>

        {/* Footer */}
        <Box sx={{ py: 3, textAlign: 'center', bgcolor: '#f8f9fa', borderTop: '1px solid #e0e0e0', mt: 'auto' }}>
          <Typography variant="body2" color="text.secondary">
            © 2026 Construct CMS. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}