/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CompanyLogo } from './CompanyLogos';
import {
  Trash2,
  User,
  FileText,
  Mail,
  Film,
  Folder,
} from 'lucide-react';

interface DesktopIconProps {
  id: string;
  title: string;
  iconType: 'company' | 'system' | 'folder';
  companyId?: string;
  systemAction?: 'about' | 'resume' | 'contact' | 'trash' | 'portfolio';
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onOpen: () => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  title,
  iconType,
  companyId,
  systemAction,
  isSelected,
  onSelect,
  onOpen,
}) => {
  // Handle double-click to open
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onOpen();
    }
  };

  // Render the icon graphic
  const renderIconGraphic = () => {
    if (iconType === 'company' && companyId) {
      return (
        <div className="relative">
          <CompanyLogo id={companyId} size={46} className="drop-shadow-md rounded-lg" />
          {/* Windows shortcut overlay badge */}
          <div className="absolute -bottom-1 -left-1 bg-white/95 rounded-sm p-[1.5px] shadow border border-neutral-300">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M7.5 2.5L2 8M7.5 2.5H4M7.5 2.5V6" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      );
    }

    if (iconType === 'system') {
      switch (systemAction) {
        case 'trash':
          return (
            <div className="w-[46px] h-[46px] rounded-lg bg-neutral-900/80 border border-neutral-600/60 flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-105 transition-transform">
              <Trash2 className="w-6 h-6 text-neutral-200" />
            </div>
          );
        case 'about':
          return (
            <div className="w-[46px] h-[46px] rounded-lg bg-neutral-800/80 border border-neutral-600/60 flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-105 transition-transform">
              <User className="w-6 h-6 text-blue-400" />
            </div>
          );
        case 'resume':
          return (
            <div className="w-[46px] h-[46px] rounded-lg bg-neutral-800/80 border border-neutral-600/60 flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6 text-amber-400" />
            </div>
          );
        case 'contact':
          return (
            <div className="w-[46px] h-[46px] rounded-lg bg-neutral-800/80 border border-neutral-600/60 flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-105 transition-transform">
              <Mail className="w-6 h-6 text-emerald-400" />
            </div>
          );
        case 'portfolio':
          return (
            <div className="w-[46px] h-[46px] rounded-lg bg-neutral-800/80 border border-neutral-600/60 flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-105 transition-transform">
              <Film className="w-6 h-6 text-rose-400" />
            </div>
          );
        default:
          return (
            <div className="w-[46px] h-[46px] rounded-lg bg-neutral-800/80 border border-neutral-600/60 flex items-center justify-center shadow-lg">
              <Folder className="w-6 h-6 text-amber-300" />
            </div>
          );
      }
    }

    return (
      <div className="w-[46px] h-[46px] rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
        <Folder className="w-6 h-6 text-amber-400" />
      </div>
    );
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      className={`group w-[82px] sm:w-[92px] p-2 flex flex-col items-center justify-start rounded cursor-pointer select-none transition-colors outline-none ${
        isSelected
          ? 'bg-blue-500/25 border border-blue-400/50 shadow-sm'
          : 'hover:bg-white/10 hover:border hover:border-white/20 border border-transparent'
      }`}
    >
      <div className="mb-1 flex items-center justify-center pointer-events-none">
        {renderIconGraphic()}
      </div>
      <span
        className={`text-[11px] sm:text-[12px] text-center leading-tight line-clamp-2 max-w-full break-words text-white ${
          isSelected
            ? 'bg-blue-600/70 px-1 py-0.5 rounded text-white font-medium'
            : 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] font-normal'
        }`}
      >
        {title}
      </span>
    </div>
  );
};
