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
  Tooltip,
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Header */}
      <Toolbar sx={{ bgcolor: '#020617', justifyContent: 'center', py: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #EAB308 0%, #F59E0B 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              boxShadow: '0 4px 14px 0 rgba(234, 179, 8, 0.4)'
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
              C
            </Typography>
          </Box>
          <Typography variant="h6" color="white" fontWeight="bold" sx={{ letterSpacing: '0.5px' }}>
            CONSTRUCT
          </Typography>
        </Box>
      </Toolbar>

      <Divider sx={{ bgcolor: '#1E293B' }} />

      {/* Navigation Menu */}
      <List sx={{ px: 2, py: 2, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => handleNav(item.path)}
            sx={{
              borderRadius: 2,
              mb: 1,
              py: 1.5,
              transition: 'all 0.2s ease',
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, #EAB308 0%, #F59E0B 100%)',
                color: 'white',
                boxShadow: '0 4px 12px 0 rgba(234, 179, 8, 0.3)',
                '& .MuiListItemIcon-root': { color: 'white' },
                '&:hover': {
                  background: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
                },
              },
              '&:hover': {
                bgcolor: '#1E293B',
                transform: 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'white' : '#94A3B8', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 600 : 400,
                fontSize: '0.95rem'
              }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ bgcolor: '#1E293B' }} />

      {/* Logout Button */}
      <List sx={{ px: 2, pb: 2 }}>
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 2,
            color: '#F87171',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'rgba(248, 113, 113, 0.1)',
              transform: 'translateX(4px)',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#F87171', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: '0.95rem'
            }}
          />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Top AppBar - now starts after sidebar on desktop */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: '#0F172A',
          color: 'white',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: '1px solid #1E293B'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{
              mr: 2,
              display: { md: 'none' },
              '&:hover': {
                bgcolor: '#1E293B',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="View Homepage">
            <IconButton
              onClick={() => navigate('/')}
              sx={{
                color: '#EAB308',
                '&:hover': {
                  bgcolor: 'rgba(234, 179, 8, 0.1)',
                }
              }}
            >
              <HomeIcon />
            </IconButton>
          </Tooltip>
          <IconButton
            onClick={handleMenu}
            sx={{
              ml: 2,
              '&:hover': {
                bgcolor: '#1E293B',
              }
            }}
          >
            <Avatar
              sx={{
                background: 'linear-gradient(135deg, #EAB308 0%, #F59E0B 100%)',
                boxShadow: '0 4px 14px 0 rgba(234, 179, 8, 0.3)'
              }}
            >
              <AccountCircle />
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                bgcolor: '#1E293B',
                color: 'white',
                border: '1px solid #334155',
                mt: 1,
                minWidth: 180,
              }
            }}
          >
            <MenuItem
              disabled
              sx={{
                color: '#94A3B8 !important',
                fontWeight: 600,
              }}
            >
              Admin User
            </MenuItem>
            <Divider sx={{ bgcolor: '#334155', my: 1 }} />
            <MenuItem
              onClick={logout}
              sx={{
                color: '#F87171',
                '&:hover': {
                  bgcolor: 'rgba(248, 113, 113, 0.1)',
                }
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Permanent Sidebar (Desktop) */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            bgcolor: '#0F172A',
            color: 'white',
            borderRight: '1px solid #1E293B',
            boxSizing: 'border-box',
          },
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
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            bgcolor: '#0F172A',
            color: 'white'
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          bgcolor: '#1E293B',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <Box sx={{ flexGrow: 1, p: { xs: 3, md: 5 } }}>
          <Outlet />
        </Box>

        {/* Footer */}
        <Box
          sx={{
            py: 3,
            textAlign: 'center',
            bgcolor: '#0F172A',
            borderTop: '1px solid #1E293B',
          }}
        >
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            © 2026 Construct CMS. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}