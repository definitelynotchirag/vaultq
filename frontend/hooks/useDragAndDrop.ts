import { useState, useCallback } from 'react';
import { File } from '@/types';

interface DragAndDropOptions {
  onDrop?: (files: File[], targetFile?: File) => void;
  onDragStart?: (files: File[]) => void;
  onDragEnd?: () => void;
}

export function useDragAndDrop({ onDrop, onDragStart, onDragEnd }: DragAndDropOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedFiles, setDraggedFiles] = useState<File[]>([]);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);

  const handleDragStart = useCallback((files: File[]) => {
    setIsDragging(true);
    setDraggedFiles(files);
    if (onDragStart) {
      onDragStart(files);
    }
  }, [onDragStart]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedFiles([]);
    setDragOverTarget(null);
    if (onDragEnd) {
      onDragEnd();
    }
  }, [onDragEnd]);

  const handleDragOver = useCallback((e: React.DragEvent, fileId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileId) {
      setDragOverTarget(fileId);
    }
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverTarget(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetFile?: File) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedFiles.length > 0 && onDrop) {
      onDrop(draggedFiles, targetFile);
    }
    
    handleDragEnd();
  }, [draggedFiles, onDrop, handleDragEnd]);

  return {
    isDragging,
    draggedFiles,
    dragOverTarget,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}



