import { useState, useCallback, useRef } from 'react';
import { File } from '@/types';

export function useFileSelection(files: File[]) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const lastSelectedIndex = useRef<number>(-1);

  const selectFile = useCallback((fileId: string, event: React.MouseEvent) => {
    const fileIndex = files.findIndex(f => f._id === fileId);
    
    if (event.metaKey || event.ctrlKey) {
      setSelectedFiles(prev => {
        if (prev.includes(fileId)) {
          return prev.filter(id => id !== fileId);
        } else {
          return [...prev, fileId];
        }
      });
      lastSelectedIndex.current = fileIndex;
    } else if (event.shiftKey && lastSelectedIndex.current !== -1) {
      const start = Math.min(lastSelectedIndex.current, fileIndex);
      const end = Math.max(lastSelectedIndex.current, fileIndex);
      const rangeIds = files.slice(start, end + 1).map(f => f._id);
      setSelectedFiles(prev => {
        const newSelection = [...prev];
        rangeIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    } else {
      setSelectedFiles([fileId]);
      lastSelectedIndex.current = fileIndex;
    }
  }, [files]);

  const selectAll = useCallback(() => {
    setSelectedFiles(files.map(f => f._id));
  }, [files]);

  const clearSelection = useCallback(() => {
    setSelectedFiles([]);
    lastSelectedIndex.current = -1;
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedFiles.length === files.length) {
      clearSelection();
    } else {
      selectAll();
    }
  }, [selectedFiles.length, files.length, clearSelection, selectAll]);

  const getSelectedFiles = useCallback(() => {
    return files.filter(f => selectedFiles.includes(f._id));
  }, [files, selectedFiles]);

  return {
    selectedFiles,
    selectFile,
    selectAll,
    clearSelection,
    toggleSelectAll,
    getSelectedFiles,
    setSelectedFiles,
  };
}

