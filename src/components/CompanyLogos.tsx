/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CompanyLogoProps {
  id: string;
  className?: string;
  size?: number;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({ id, className = '', size = 48 }) => {
  switch (id) {
    case 'buraq':
      // Buraq Energy Solutions: Clean green solar leaf / energetic burst logo with clean modern emblem
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="48" height="48" rx="8" fill="#064E3B" />
          <path
            d="M24 8L28.5 18L39 19.5L31.5 27L33 37.5L24 32.5L15 37.5L16.5 27L9 19.5L19.5 18L24 8Z"
            fill="#10B981"
            fillOpacity="0.3"
          />
          <path
            d="M24 12C20 18 16 23 16 29C16 33.4 19.6 37 24 37C28.4 37 32 33.4 32 29C32 23 28 18 24 12Z"
            fill="#34D399"
          />
          <path
            d="M24 17C22 22 19 25 19 29C19 31.8 21.2 34 24 34V17Z"
            fill="#059669"
          />
          <circle cx="24" cy="24" r="3" fill="#A7F3D0" />
        </svg>
      );

    case 'tfs':
      // TFS: Bold red & white geometric speed monogram
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="48" height="48" rx="8" fill="#18181B" stroke="#27272A" />
          <rect x="6" y="6" width="36" height="36" rx="6" fill="#DC2626" />
          {/* TFS letters */}
          <text
            x="24"
            y="29"
            fill="#FFFFFF"
            fontSize="14"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
            textAnchor="middle"
            letterSpacing="-0.5"
          >
            TFS
          </text>
          <path d="M12 34H36" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'hitradio':
      // HIT RADIO: Iconic vibrant yellow-orange background with bold red/black broadcast branding
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="48" height="48" rx="8" fill="#FBBF24" />
          <circle cx="24" cy="24" r="18" fill="#F59E0B" />
          <rect x="8" y="16" width="32" height="16" rx="3" fill="#DC2626" />
          <text
            x="24"
            y="28"
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="900"
            fontFamily="Impact, sans-serif"
            textAnchor="middle"
            letterSpacing="0.5"
          >
            HIT RADIO
          </text>
        </svg>
      );

    case 'el25':
      // El 25 Studio: Minimal luxury studio emblem in gold and charcoal with camera frame
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="48" height="48" rx="8" fill="#1C1917" stroke="#44403C" strokeWidth="1" />
          <rect x="8" y="8" width="32" height="32" stroke="#D97706" strokeWidth="1.5" rx="3" />
          <circle cx="24" cy="24" r="9" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="3 2" />
          <text
            x="24"
            y="28"
            fill="#FDE68A"
            fontSize="12"
            fontWeight="700"
            fontFamily="'Times New Roman', serif"
            textAnchor="middle"
          >
            EL 25
          </text>
        </svg>
      );

    case 'connexion':
      // Connexion Media: Interlinked digital connection nodes in electric blue
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="48" height="48" rx="8" fill="#0F172A" stroke="#1E293B" />
          <circle cx="17" cy="24" r="7" stroke="#3B82F6" strokeWidth="3" />
          <circle cx="31" cy="24" r="7" stroke="#60A5FA" strokeWidth="3" />
          <path d="M17 24L31 24" stroke="#93C5FD" strokeWidth="2.5" />
          <circle cx="24" cy="24" r="3" fill="#2563EB" />
        </svg>
      );

    case 'pfl':
      // PFL Africa: MMA octagon shield emblem in gold & deep obsidian
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="48" height="48" rx="8" fill="#09090B" stroke="#27272A" />
          {/* Octagon shape */}
          <polygon
            points="16,8 32,8 40,16 40,32 32,40 16,40 8,32 8,16"
            fill="#18181B"
            stroke="#EAB308"
            strokeWidth="1.5"
          />
          <text
            x="24"
            y="26"
            fill="#EAB308"
            fontSize="12"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
            textAnchor="middle"
          >
            PFL
          </text>
          <text
            x="24"
            y="33"
            fill="#CA8A04"
            fontSize="6"
            fontWeight="700"
            fontFamily="Arial, sans-serif"
            textAnchor="middle"
            letterSpacing="1"
          >
            AFRICA
          </text>
        </svg>
      );

    case 'mondial':
      // Mondial Makeup Academy: Paris prestige cosmetics seal in rose magenta
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="48" height="48" rx="8" fill="#3D0C29" />
          <circle cx="24" cy="24" r="16" stroke="#F472B6" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="24" cy="24" r="13" stroke="#DB2777" strokeWidth="1" />
          <text
            x="24"
            y="28"
            fill="#FBCFE8"
            fontSize="16"
            fontWeight="300"
            fontFamily="Georgia, serif"
            fontStyle="italic"
            textAnchor="middle"
          >
            M
          </text>
          <text
            x="24"
            y="35"
            fill="#F472B6"
            fontSize="5"
            fontWeight="700"
            fontFamily="sans-serif"
            textAnchor="middle"
            letterSpacing="1.5"
          >
            MONDIAL
          </text>
        </svg>
      );

    case 'eyemazing':
      // EYEMAZING: Cyan optical aperture iris with reflections
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="48" height="48" rx="8" fill="#082F49" />
          <circle cx="24" cy="24" r="15" stroke="#06B6D4" strokeWidth="2" />
          <ellipse cx="24" cy="24" rx="14" ry="8" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="24" cy="24" r="5" fill="#0EA5E9" />
          <circle cx="22" cy="22" r="1.8" fill="#FFFFFF" />
        </svg>
      );

    case 'somo':
      // SOMO SOLUTIONS: Interconnected hexagonal cloud nodes in purple/violet
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="48" height="48" rx="8" fill="#2E1065" stroke="#4C1D95" />
          <polygon
            points="24,10 36,17 36,31 24,38 12,31 12,17"
            stroke="#8B5CF6"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="24" cy="17" r="3" fill="#C4B5FD" />
          <circle cx="18" cy="28" r="3" fill="#A78BFA" />
          <circle cx="30" cy="28" r="3" fill="#A78BFA" />
          <path d="M24 17L18 28M24 17L30 28M18 28L30 28" stroke="#7C3AED" strokeWidth="1.5" />
        </svg>
      );

    default:
      return (
        <div
          style={{ width: size, height: size }}
          className="rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-white uppercase"
        >
          {id.slice(0, 3)}
        </div>
      );
  }
};
