'use client';

import { useAuth } from '@/hooks/useAuth';
import { Grid3x3, HelpCircle, Search, Settings, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface TopBarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function TopBar({ onSearch, searchQuery }: TopBarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = async () => {
    await logout();
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
    <div className="h-16 bg-white border-b border-[#e5e5e5] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] flex items-center justify-between px-3 sm:px-4 md:px-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-6 flex-1 min-w-0">
        <div className="flex items-center gap-2 md:gap-3 w-auto md:w-[200px] shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shrink-0 ml-10 md:ml-0">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10">
              <path d="M8 12C8 10.8954 8.89543 10 10 10H16.1716C16.702 10 17.2107 10.2107 17.5858 10.5858L21.4142 14.4142C21.7893 14.7893 22.298 15 22.8284 15H30C31.1046 15 32 15.8954 32 17V28C32 29.1046 31.1046 30 30 30H10C8.89543 30 8 29.1046 8 28V12Z" fill="#4285F4"/>
              <path d="M20 10V15C20 16.1046 20.8954 17 22 17H27L20 10Z" fill="#AECBFA"/>
            </svg>
          </div>
          <span className="text-lg md:text-[22px] text-[#5f6368] font-normal hidden sm:block" style={{ fontFamily: 'var(--font-sans)' }}>
            VaultQ
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-[720px] mx-auto hidden md:flex">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-3 text-[#5f6368] w-5 h-5 pointer-events-none z-10" />
            <input
              ref={(el) => {
                if (el) {
                  (window as any).__searchInputRef = el;
                }
              }}
              type="text"
              placeholder="Search in VaultQ"
              value={searchValue}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`w-full h-12 pl-11 pr-11 rounded-lg border-none outline-none transition-hover ${
                isSearchFocused ? 'bg-white shadow-md' : 'bg-[#f1f3f4] hover:bg-[#e8eaed]'
              }`}
              style={{ fontSize: '16px', color: '#202124' }}
            />
            {searchValue && (
              <button
                onClick={() => {
                  setSearchValue('');
                  onSearch('');
                }}
                className="absolute right-3 text-[#5f6368] hover:text-[#202124] transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
        <button className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors" aria-label="Help">
          <HelpCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-[#5f6368]" />
        </button>
        <button className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors hidden sm:flex" aria-label="Settings">
          <Settings className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-[#5f6368]" />
        </button>
        <button className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors hidden sm:flex" aria-label="Google apps">
          <Grid3x3 className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-[#5f6368]" />
        </button>
        <div className="relative ml-1 sm:ml-1.5 md:ml-2" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 rounded-full border border-[#dadce0] bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
            aria-label="Account menu"
          >
            <span className="text-xs font-medium text-[#5f6368]">
              {user ? getInitials(user.name) : 'U'}
            </span>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-11 w-56 sm:w-64 bg-white border border-[#e5e5e5] rounded-lg shadow-lg py-2 z-50">
              <div className="px-4 py-3 border-b border-[#e5e5e5]">
                <div className="text-[#202124] font-medium text-sm">{user?.name}</div>
                <div className="text-[#5f6368] text-xs mt-1 break-words">{user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-[#202124] hover:bg-[#f1f3f4] transition-colors mt-1"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
