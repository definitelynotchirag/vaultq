'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/lib/colors';
import { Close, Menu as MenuIcon, Search as SearchIcon } from '@mui/icons-material';
import { AppBar, Avatar, Box, IconButton, InputBase, Menu, MenuItem, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface TopBarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function TopBar({ onSearch, searchQuery }: TopBarProps) {
  const { user, logout } = useAuth();
  const { toggleCollapse } = useSidebar();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    router.push('/');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: colors.background.default,
        color: colors.text.primary,
        boxShadow: colors.shadow.light,
      }}
    >
      <Toolbar sx={{ px: { xs: 1.5, sm: 2, md: 3 }, gap: { xs: 1, sm: 1.5, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1, md: 1.25 }, minWidth: { md: 200 } }}>
          {!isMobile && (
            <IconButton
              onClick={toggleCollapse}
              sx={{
                width: { xs: 32, md: 40 },
                height: { xs: 32, md: 40 },
                color: colors.text.secondary,
                '&:hover': {
                  backgroundColor: colors.background.hover,
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box
            sx={{
              width: { xs: 40, md: 48 },
              height: { xs: 40, md: 48 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ml: { xs: 5, md: 0 },
            }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12C8 10.8954 8.89543 10 10 10H16.1716C16.702 10 17.2107 10.2107 17.5858 10.5858L21.4142 14.4142C21.7893 14.7893 22.298 15 22.8284 15H30C31.1046 15 32 15.8954 32 17V28C32 29.1046 31.1046 30 30 30H10C8.89543 30 8 29.1046 8 28V12Z" fill={colors.primary.light}/>
              <path d="M20 10V15C20 16.1046 20.8954 17 22 17H27L20 10Z" fill="#AECBFA"/>
            </svg>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1rem', md: '1.375rem' },
              color: colors.text.secondary,
              fontWeight: 400,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            VaultQ
          </Typography>
        </Box>

        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            flex: 1,
            maxWidth: 720,
            mx: 'auto',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <SearchIcon
              sx={{
                position: 'absolute',
                left: 12,
                color: colors.text.secondary,
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
            <InputBase
              inputRef={(el) => {
                if (el) {
                  (window as unknown as Record<string, unknown>).__searchInputRef = el;
                }
              }}
              placeholder="Search in VaultQ"
              value={searchValue}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              sx={{
                width: '100%',
                height: 48,
                pl: 5.5,
                pr: searchValue ? 5.5 : 3,
                borderRadius: 2,
                fontSize: 16,
                color: colors.text.primary,
                backgroundColor: isSearchFocused ? colors.background.default : colors.background.hover,
                boxShadow: isSearchFocused ? colors.shadow.medium : 'none',
                transition: 'all 150ms ease',
                '&:hover': {
                  backgroundColor: isSearchFocused ? colors.background.default : colors.background.selected,
                },
                '& .MuiInputBase-input': {
                  '&::placeholder': {
                    opacity: 1,
                    color: colors.text.secondary,
                  },
                },
              }}
            />
            {searchValue && (
              <IconButton
                onClick={() => {
                  setSearchValue('');
                  onSearch('');
                }}
                sx={{
                  position: 'absolute',
                  right: 8,
                  color: colors.text.secondary,
                  '&:hover': { color: colors.text.primary },
                }}
                size="small"
              >
                <Close fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1, md: 1.5 } }}>
          <Box ref={userMenuRef} sx={{ position: 'relative', ml: { xs: 0.5, sm: 1, md: 1.5 } }}>
            <IconButton
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
                setShowUserMenu(true);
              }}
              sx={{
                border: `1px solid ${colors.border.light}`,
                backgroundColor: colors.background.default,
                '&:hover': { backgroundColor: colors.overlay.black04 },
                width: { xs: 32, sm: 36, md: 40 },
                height: { xs: 32, sm: 36, md: 40 },
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 24, sm: 28, md: 32 },
                  height: { xs: 24, sm: 28, md: 32 },
                  bgcolor: 'transparent',
                  color: colors.text.secondary,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  fontWeight: 500,
                }}
              >
                {user ? getInitials(user.name) : 'U'}
              </Avatar>
            </IconButton>
            <Menu
              open={showUserMenu}
              onClose={() => {
                setShowUserMenu(false);
                setAnchorEl(null);
              }}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: { xs: 224, sm: 256 },
                  boxShadow: colors.shadow.menu,
                  border: `1px solid ${colors.border.default}`,
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${colors.border.default}` }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.primary }}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', wordBreak: 'break-word' }}>
                  {user?.email}
                </Typography>
              </Box>
              <MenuItem
              onClick={() => {
                handleLogout();
                setAnchorEl(null);
              }}
              sx={{
                mt: 0.5,
                '&:hover': { backgroundColor: colors.background.hover },
              }}
            >
              Sign out
            </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
