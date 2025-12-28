'use client';

import { colors } from '@/lib/colors';
import {
    AccessTime,
    Add,
    ChevronLeft,
    ChevronRight,
    Close,
    Delete,
    Home,
    Menu as MenuIcon,
    People,
    Star,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
    useTheme
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SidebarProps {
  onNewClick: () => void;
}

const drawerWidth = 256;
const collapsedWidth = 72;

export function Sidebar({ onNewClick }: SidebarProps) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'My Drive', icon: Home },
    { href: '/shared', label: 'Shared with me', icon: People },
    { href: '/recent', label: 'Recent', icon: AccessTime },
    { href: '/starred', label: 'Starred', icon: Star },
    { href: '/trash', label: 'Trash', icon: Delete },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  useEffect(() => {
    if (!isMobile) {
      document.documentElement.style.setProperty(
        '--sidebar-width',
        isCollapsed ? `${collapsedWidth}px` : `${drawerWidth}px`
      );
    } else {
      document.documentElement.style.setProperty('--sidebar-width', '0px');
    }
  }, [isCollapsed, isMobile]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: { xs: 2, sm: 2.5 }, pb: 1 }}>
        {!isCollapsed && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              onNewClick();
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              borderRadius: 7,
              px: 3,
              py: 1.5,
              minWidth: { xs: 120, sm: 140 },
              textTransform: 'none',
              backgroundColor: colors.background.default,
              color: colors.secondary.dark,
              border: `1px solid ${colors.border.light}`,
              boxShadow: colors.shadow.card,
              '&:hover': {
                backgroundColor: colors.background.light,
                boxShadow: colors.shadow.medium,
              },
              '&:active': {
                backgroundColor: colors.background.hover,
              },
            }}
          >
            New
          </Button>
        )}
        {isCollapsed && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <IconButton
              onClick={() => {
                onNewClick();
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                width: 40,
                height: 40,
                border: `1px solid ${colors.border.light}`,
                backgroundColor: colors.background.default,
                boxShadow: colors.shadow.card,
                '&:hover': {
                  backgroundColor: colors.background.light,
                  boxShadow: colors.shadow.medium,
                },
                '&:active': {
                  backgroundColor: colors.background.hover,
                },
              }}
            >
              <Add />
            </IconButton>
          </Box>
        )}
      </Box>

      <List sx={{ flex: 1, overflowY: 'auto', py: 1, px: { xs: 1.5, sm: 2 } }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={() => {
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  minHeight: 40,
                  borderRadius: '0 20px 20px 0',
                  px: { xs: 2, sm: 3 },
                  backgroundColor: active ? '#c2e7ff' : 'transparent',
                  color: active ? '#001d35' : colors.text.secondary,
                  fontWeight: active ? 500 : 400,
                  '&:hover': {
                    backgroundColor: active ? '#c2e7ff' : colors.background.hover,
                  },
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: isCollapsed ? 0 : 40,
                    color: 'inherit',
                  }}
                >
                  <Icon />
                </ListItemIcon>
                {!isCollapsed && <ListItemText primary={item.label} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {!isMobile && (
        <IconButton
          onClick={() => setIsCollapsed(!isCollapsed)}
          sx={{
            position: 'absolute',
            right: -12,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 24,
            height: 24,
            backgroundColor: colors.background.default,
            border: `1px solid ${colors.border.default}`,
            boxShadow: colors.shadow.light,
            '&:hover': {
              backgroundColor: colors.background.hover,
            },
            zIndex: (theme) => theme.zIndex.drawer + 100,
          }}
        >
          {isCollapsed ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
        </IconButton>
      )}
    </Box>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: 18,
            left: 16,
            zIndex: (theme) => theme.zIndex.drawer + 2,
            backgroundColor: colors.background.default,
            border: `1px solid ${colors.border.default}`,
            boxShadow: colors.shadow.light,
            '&:hover': {
              backgroundColor: colors.background.hover,
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: isCollapsed && !isMobile ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isCollapsed && !isMobile ? collapsedWidth : drawerWidth,
            boxSizing: 'border-box',
            borderRight: `1px solid ${colors.border.default}`,
            top: 64,
            height: 'calc(100vh - 64px)',
            transition: 'width 300ms ease',
          },
        }}
      >
        {isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={handleDrawerToggle} size="small">
              <Close />
            </IconButton>
          </Box>
        )}
        {drawerContent}
      </Drawer>
      {isMobile && mobileOpen && (
        <Box
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        />
      )}
    </>
  );
}
