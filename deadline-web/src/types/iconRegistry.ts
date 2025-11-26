import { LucideIcon } from 'lucide-react';
import { GothicIconVariant } from '@/components/GothicIcon';

/**
 * Icon registry entry for tracking icon usage and migration status
 */
export interface IconRegistryEntry {
  /** Descriptive name of the icon */
  name: string;
  /** The lucide-react icon component */
  component: LucideIcon;
  /** The gothic variant to apply */
  variant: GothicIconVariant;
  /** List of components/pages where this icon is used */
  usage: string[];
  /** Whether this icon has been migrated to the gothic system */
  migrated: boolean;
}

/**
 * Complete icon registry type
 */
export type IconRegistry = Record<string, IconRegistryEntry>;
