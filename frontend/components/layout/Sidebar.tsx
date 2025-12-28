'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import { useStorage } from '@/hooks/useStorage';
import { colors } from '@/lib/colors';
import {
  AccessTime,
  Add,
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
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
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
  const { isCollapsed } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { storage, formatBytes, loading } = useStorage();

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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ p: { xs: 2, sm: 2.5 }, pb: 1, overflow: 'hidden' }}>
        {!isCollapsed && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              onNewClick();
              if (isMobile) setMobileOpen(false);
            }}
            fullWidth
            sx={{
              borderRadius: 7,
              px: 3,
              py: 1.5,
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

      <List sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1, px: { xs: 1.5, sm: 2 } }}>
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
                  borderRadius: active ? '20px' : '0 20px 20px 0',
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

      {(storage || loading) && (
        <>
          {!isCollapsed ? (
            <Box
              sx={{
                px: { xs: 2, sm: 3 },
                pb: 2,
                pt: 1,
                borderTop: `1px solid ${colors.border.default}`,
                overflow: 'hidden',
              }}
            >
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      color: colors.text.secondary,
                      fontWeight: 500,
                    }}
                  >
                    Storage
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      color: colors.text.secondary,
                    }}
                  >
                    {storage ? `${formatBytes(storage.used)} of ${formatBytes(storage.limit)}` : 'Loading...'}
                  </Typography>
                </Box>
                <LinearProgress
                  variant={storage ? "determinate" : "indeterminate"}
                  value={storage ? Math.min(storage.percentage, 100) : 0}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: colors.background.hover,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor:
                        storage && storage.percentage > 90
                          ? '#f44336'
                          : storage && storage.percentage > 75
                          ? '#ff9800'
                          : colors.primary.main,
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  fontSize: { xs: '0.65rem', sm: '0.7rem' },
                  color: colors.text.secondary,
                  display: 'block',
                }}
              >
                {storage ? `${formatBytes(storage.available)} available` : 'Calculating...'}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                px: 1,
                pb: 2,
                pt: 1,
                borderTop: `1px solid ${colors.border.default}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <LinearProgress
                variant={storage ? "determinate" : "indeterminate"}
                value={storage ? Math.min(storage.percentage, 100) : 0}
                sx={{
                  width: '100%',
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: colors.background.hover,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor:
                      storage && storage.percentage > 90
                        ? '#f44336'
                        : storage && storage.percentage > 75
                        ? '#ff9800'
                        : colors.primary.main,
                    borderRadius: 2,
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.6rem',
                  color: colors.text.secondary,
                  textAlign: 'center',
                  lineHeight: 1,
                }}
              >
                {storage ? `${Math.round(storage.percentage)}%` : '...'}
              </Typography>
            </Box>
          )}
        </>
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
            overflow: 'hidden',
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
