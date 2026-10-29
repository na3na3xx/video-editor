/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Minus, Square, Copy, X } from 'lucide-react';

interface WindowFrameProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  onFocus: () => void;
  onMinimize: () => void;
  onMaximizeToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  title,
  icon,
  initialPosition = { x: 100, y: 50 },
  initialSize = { width: 850, height: 550 },
  isMinimized,
  isMaximized,
  zIndex,
  onFocus,
  onMinimize,
  onMaximizeToggle,
  onClose,
  children,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const isDraggingRef = useRef(false);
  const dragStartOffsetRef = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Clamp position within viewport
  const updatePositionSafely = useCallback((newX: number, newY: number) => {
    const maxX = Math.max(0, window.innerWidth - 100);
    const maxY = Math.max(0, window.innerHeight - 80);
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  }, []);

  // Dragging logic on titlebar
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    onFocus();
    isDraggingRef.current = true;
    dragStartOffsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const newX = e.clientX - dragStartOffsetRef.current.x;
      const newY = e.clientY - dragStartOffsetRef.current.y;
      updatePositionSafely(newX, newY);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [updatePositionSafely]);

  // Touch dragging support for tablets/mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMaximized || e.touches.length === 0) return;
    onFocus();
    isDraggingRef.current = true;
    dragStartOffsetRef.current = {
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    };
  };

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length === 0) return;
      const newX = e.touches[0].clientX - dragStartOffsetRef.current.x;
      const newY = e.touches[0].clientY - dragStartOffsetRef.current.y;
      updatePositionSafely(newX, newY);
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [updatePositionSafely]);

  // Adaptive initial sizing for smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight - 48, // 48px taskbar
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMinimized) return null;

  return (
    <div
      ref={windowRef}
      onMouseDown={onFocus}
      style={{
        zIndex,
        ...(isMaximized || window.innerWidth < 768
          ? {
              left: 0,
              top: 0,
              width: '100vw',
              height: 'calc(100vh - 48px)',
              transform: 'none',
              borderRadius: 0,
            }
          : {
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: `${Math.min(size.width, window.innerWidth - 20)}px`,
              height: `${Math.min(size.height, window.innerHeight - 60)}px`,
            }),
      }}
      className={`fixed flex flex-col bg-neutral-900/95 backdrop-blur-xl border border-neutral-700/80 text-neutral-100 shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-150 ${
        isMaximized || window.innerWidth < 768 ? 'rounded-none border-x-0 border-t-0' : 'rounded-lg'
      }`}
    >
      {/* Title bar */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDoubleClick={onMaximizeToggle}
        className="h-10 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between px-3 select-none cursor-move shrink-0"
      >
        {/* Left: icon & title */}
        <div className="flex items-center gap-2.5 overflow-hidden">
          {icon && <div className="shrink-0">{icon}</div>}
          <span className="text-xs sm:text-[13px] font-medium text-neutral-200 truncate tracking-wide">
            {title}
          </span>
        </div>

        {/* Right: Windows controls (Minimize, Maximize, Close) */}
        <div className="flex items-center h-full -mr-3">
          <button
            type="button"
            aria-label="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="w-11 h-10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            aria-label={isMaximized ? 'Restore' : 'Maximize'}
            onClick={(e) => {
              e.stopPropagation();
              onMaximizeToggle();
            }}
            className="w-11 h-10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            {isMaximized ? <Copy className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-11 h-10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-auto bg-neutral-950/90 text-neutral-100 flex flex-col">
        {children}
      </div>
    </div>
  );
};
