/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FileType = 'video' | 'image' | 'pdf' | 'folder' | 'project';

export interface BeforeAfterComparison {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  description: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  filename: string;
  extension: string;
  type: FileType;
  size: string;
  dateModified: string;
  thumbnail: string;
  mediaUrl: string;
  client: string;
  role: string;
  software: string[];
  description: string;
  duration?: string;
  resolution?: string;
  aspectRatio?: string;
  beforeAfter?: BeforeAfterComparison;
  tags: string[];
}

export interface Company {
  id: string;
  name: string;
  shortName: string;
  category: string;
  logoSvg: string; // SVG code or image path
  accentColor: string;
  description: string;
  overview: string;
  myRole: string;
  deliverables: string[];
  clientLocation: string;
  year: string;
  files: ProjectFile[];
}

export type WindowType =
  | 'company'
  | 'file-viewer'
  | 'about'
  | 'resume'
  | 'contact'
  | 'trash'
  | 'portfolio'
  | 'app-info';

export interface WindowItem {
  id: string;
  title: string;
  type: WindowType;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  companyId?: string;
  fileData?: ProjectFile;
  appId?: string;
}

export interface DesktopShortcut {
  id: string;
  title: string;
  iconType: 'company' | 'system' | 'folder';
  companyId?: string;
  systemAction?: 'about' | 'resume' | 'contact' | 'trash' | 'portfolio';
  column: number;
  row: number;
  shortcutBadge?: boolean;
}
