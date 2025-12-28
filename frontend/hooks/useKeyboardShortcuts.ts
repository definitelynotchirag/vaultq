import { useEffect, useRef } from 'react';

interface KeyboardShortcutsOptions {
  onSelectAll?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  onUndo?: () => void;
  onFocusSearch?: () => void;
  onOpen?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onSelectAll,
  onDelete,
  onDownload,
  onUndo,
  onFocusSearch,
  onOpen,
  enabled = true,
}: KeyboardShortcutsOptions) {
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? event.metaKey : event.ctrlKey;

      if (event.key === '/' && !event.shiftKey) {
        const target = event.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          event.preventDefault();
          if (onFocusSearch) {
            onFocusSearch();
          }
          const searchInput = (window as any).__searchInputRef as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        }
      }

      if (modKey && event.key === 'a') {
        event.preventDefault();
        if (onSelectAll) {
          onSelectAll();
        }
      }

      if (modKey && event.key === 'd') {
        event.preventDefault();
        if (onDownload) {
          onDownload();
        }
      }

      if (modKey && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (onUndo) {
          onUndo();
        }
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        const target = event.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          event.preventDefault();
          if (onDelete) {
            onDelete();
          }
        }
      }

      if (event.key === 'Enter') {
        const target = event.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          if (onOpen) {
            onOpen();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onSelectAll, onDelete, onDownload, onUndo, onFocusSearch, onOpen]);

  return { searchInputRef };
}

