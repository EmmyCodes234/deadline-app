import React from 'react';

/**
 * Variant configuration for gothic icon styling
 */
export type VariantConfig = {
  color: string;           // Tailwind color class
  glowColor: string;       // RGB values for drop-shadow
  hoverGlowColor: string;  // RGB values for hover state
  intensity: number;       // Glow intensity multiplier
};

/**
 * Available gothic icon variants
 */
export type GothicIconVariant = 'blood' | 'arcane' | 'soul' | 'relic' | 'neutral';

/**
 * Available size presets
 */
export type GothicIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Props for the GothicIcon component
 */
export interface GothicIconProps {
  /** Color variant for thematic styling */
  variant?: GothicIconVariant;
  /** Size of the icon (preset or custom number) */
  size?: GothicIconSize | number;
  /** Whether the icon should have interactive hover/active states */
  interactive?: boolean;
  /** Whether the icon is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
  /** Accessibility label for screen readers */
  'aria-label'?: string;
  /** Whether the icon is decorative only */
  'aria-hidden'?: boolean;
  /** lucide-react icon component */
  children: React.ReactElement;
}

/**
 * Variant configurations mapping
 */
export const VARIANTS: Record<GothicIconVariant, VariantConfig> = {
  blood: {
    color: 'text-red-500',
    glowColor: 'rgba(239, 68, 68, 0.8)',
    hoverGlowColor: 'rgba(239, 68, 68, 1)',
    intensity: 1.2
  },
  arcane: {
    color: 'text-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.8)',
    hoverGlowColor: 'rgba(168, 85, 247, 1)',
    intensity: 1.2
  },
  soul: {
    color: 'text-teal-400',
    glowColor: 'rgba(45, 212, 191, 0.8)',
    hoverGlowColor: 'rgba(45, 212, 191, 1)',
    intensity: 1.0
  },
  relic: {
    color: 'text-amber-300',
    glowColor: 'rgba(252, 211, 77, 0.8)',
    hoverGlowColor: 'rgba(252, 211, 77, 1)',
    intensity: 1.1
  },
  neutral: {
    color: 'text-gray-400',
    glowColor: 'rgba(156, 163, 175, 0.5)',
    hoverGlowColor: 'rgba(156, 163, 175, 0.7)',
    intensity: 0.8
  }
};

/**
 * Size presets in pixels
 */
export const SIZES: Record<GothicIconSize, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48
};

/**
 * GothicIcon - A wrapper component that applies gothic styling to lucide-react icons
 * 
 * This component creates the appearance of glowing, arcane artifacts by applying
 * thematic colors and drop-shadow effects to base icon shapes.
 * 
 * @example
 * ```tsx
 * import { Skull } from 'lucide-react';
 * import { GothicIcon } from '@/components/GothicIcon';
 * 
 * <GothicIcon variant="relic" size="md">
 *   <Skull />
 * </GothicIcon>
 * ```
 */
export const GothicIcon: React.FC<GothicIconProps> = ({
  variant = 'neutral',
  size = 'md',
  interactive = false,
  disabled = false,
  className = '',
  style = {},
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  children
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  // Validate that children is a valid React element
  if (!React.isValidElement(children)) {
    throw new Error('GothicIcon: children must be a valid React element (lucide-react icon)');
  }

  // Warn in development if interactive icon lacks aria-label
  if (process.env.NODE_ENV === 'development') {
    if (interactive && !ariaLabel && !ariaHidden) {
      console.warn('GothicIcon: Interactive icons should have an aria-label for accessibility');
    }
  }

  // Calculate the numeric size
  const numericSize = typeof size === 'number' ? size : SIZES[size];

  // Calculate padding needed to reach minimum touch target (44x44px) for interactive icons
  const minTouchTarget = 44;
  const paddingNeeded = interactive && !disabled && numericSize < minTouchTarget
    ? Math.ceil((minTouchTarget - numericSize) / 2)
    : 0;

  // Build CSS class names for gothic icon styling
  const gothicClasses = [
    'gothic-icon',
    `gothic-icon-${variant}`,
    interactive && !disabled ? 'gothic-icon-interactive' : '',
    disabled ? 'gothic-icon-disabled' : '',
    typeof size === 'string' ? `gothic-icon-${size}` : '',
    className
  ].filter(Boolean).join(' ');

  // Merge styles with GPU acceleration optimizations
  const mergedStyle: React.CSSProperties = {
    padding: paddingNeeded > 0 ? `${paddingNeeded}px` : undefined,
    minWidth: interactive && !disabled ? `${minTouchTarget}px` : undefined,
    minHeight: interactive && !disabled ? `${minTouchTarget}px` : undefined,
    // GPU acceleration hints for better performance
    willChange: interactive && !disabled ? 'filter, transform' : undefined,
    // Use transform for animations to leverage GPU
    transform: interactive && !disabled && isActive ? 'scale(0.95)' : 
               interactive && !disabled && (isHovered || isFocused) ? 'scale(1.05)' : 
               undefined,
    ...style,
  };

  // Clone the icon child with size props
  const iconElement = React.cloneElement(children, {
    size: numericSize,
    strokeWidth: 2,
  } as any);

  // Event handlers for interactive state
  const handleMouseEnter = () => {
    if (interactive && !disabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (interactive && !disabled) {
      setIsHovered(false);
      setIsActive(false);
    }
  };

  const handleMouseDown = () => {
    if (interactive && !disabled) {
      setIsActive(true);
    }
  };

  const handleMouseUp = () => {
    if (interactive && !disabled) {
      setIsActive(false);
    }
  };

  const handleFocus = () => {
    if (interactive && !disabled) {
      setIsFocused(true);
    }
  };

  const handleBlur = () => {
    if (interactive && !disabled) {
      setIsFocused(false);
    }
  };

  return (
    <span
      className={gothicClasses}
      style={mergedStyle}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      tabIndex={interactive && !disabled ? 0 : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {iconElement}
    </span>
  );
};
