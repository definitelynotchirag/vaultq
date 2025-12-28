'use client';

import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  Menu,
  Plus,
  Star,
  Trash2,
  Users,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SidebarProps {
  onNewClick: () => void;
}

export function Sidebar({ onNewClick }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'My Drive', icon: Home },
    { href: '/shared', label: 'Shared with me', icon: Users },
    { href: '/recent', label: 'Recent', icon: Clock },
    { href: '/starred', label: 'Starred', icon: Star },
    { href: '/trash', label: 'Trash', icon: Trash2 },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '72px' : '256px');
  }, [isCollapsed]);

  const sidebarWidth = isCollapsed ? 'w-[72px]' : 'w-64';
  const storageUsed = 14.12;
  const storageTotal = 15;
  const storagePercent = (storageUsed / storageTotal) * 100;

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-[18px] left-4 z-50 bg-white p-2 rounded-lg shadow-md border border-[#e5e5e5] hover:bg-[#f1f3f4] transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-[#5f6368]" />
      </button>
      <div
        className={`${sidebarWidth} bg-white border-r border-[#e5e5e5] h-[calc(100vh-64px)] flex flex-col fixed left-0 top-16 z-40 transition-sidebar ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 pt-4 sm:pt-5 pb-2">
          {!isCollapsed && (
            <div className="mb-3 sm:mb-4">
              <button
                onClick={() => {
                  onNewClick();
                  setIsMobileOpen(false);
                }}
                className="w-[120px] sm:w-[140px] h-12 sm:h-14 bg-white border border-[#dadce0] rounded-[24px] sm:rounded-[28px] shadow-[0_1px_2px_0_rgba(60,64,67,.3),0_1px_3px_1px_rgba(60,64,67,.15)] hover:shadow-[0_1px_3px_0_rgba(60,64,67,.3),0_4px_8px_3px_rgba(60,64,67,.15)] hover:bg-[#f8f9fa] active:bg-[#f1f3f4] flex items-center gap-3 px-5 sm:px-6 transition-all"
              >
                <Plus className="w-5 h-5 text-[#5f6368]" />
                <span className="text-sm font-medium text-[#3c4043]">New</span>
              </button>
            </div>
          )}
          {isCollapsed && (
            <div className="mb-4 flex justify-center">
              <button
                onClick={() => {
                  onNewClick();
                  setIsMobileOpen(false);
                }}
                className="w-10 h-10 rounded-full bg-white border border-[#dadce0] shadow-[0_1px_2px_0_rgba(60,64,67,.3),0_1px_3px_1px_rgba(60,64,67,.15)] hover:shadow-[0_1px_3px_0_rgba(60,64,67,.3),0_4px_8px_3px_rgba(60,64,67,.15)] hover:bg-[#f8f9fa] active:bg-[#f1f3f4] flex items-center justify-center transition-all"
                aria-label="New"
              >
                <Plus className="w-5 h-5 text-[#5f6368]" />
              </button>
            </div>
          )}
          </div>

          <nav className={`flex-1 overflow-y-auto py-2 ${isCollapsed ? 'px-3' : 'px-3 sm:px-4'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`h-10 py-0 mb-1 flex items-center gap-3 sm:gap-4 text-sm transition-colors ${
                  active
                    ? 'bg-[#c2e7ff] text-[#001d35] font-medium rounded-r-[20px]'
                    : 'text-[#5f6368] hover:bg-[#f1f3f4] rounded-r-[20px]'
                } ${isCollapsed ? 'justify-center px-3' : 'px-4 sm:px-6'}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
          </nav>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border border-[#e5e5e5] rounded-full shadow-sm hover:bg-[#f1f3f4] items-center justify-center transition-colors z-10"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-[#5f6368]" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-[#5f6368]" />
          )}
        </button>

        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden absolute top-3 right-3 text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
