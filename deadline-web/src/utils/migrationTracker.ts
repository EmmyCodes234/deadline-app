/**
 * Migration Tracking System
 * 
 * Tracks which icons have been migrated to the Gothic Iconography System
 * and generates progress reports.
 * 
 * Requirements: 6.1, 6.5
 */

import { iconRegistry, getMigrationStats, getIconsByCategory, getUnmigratedIcons } from '@/data/iconRegistry';
import { IconRegistryEntry } from '@/types/iconRegistry';

/**
 * Category migration status
 */
export interface CategoryMigrationStatus {
  category: string;
  total: number;
  migrated: number;
  remaining: number;
  percentage: number;
  icons: Array<{
    key: string;
    name: string;
    migrated: boolean;
    usage: string[];
  }>;
}

/**
 * Complete migration report
 */
export interface MigrationReport {
  timestamp: string;
  overall: {
    total: number;
    migrated: number;
    remaining: number;
    percentage: number;
  };
  byCategory: CategoryMigrationStatus[];
  byVariant: {
    blood: number;
    arcane: number;
    soul: number;
    relic: number;
    neutral: number;
  };
  unmigrated: Array<{
    key: string;
    name: string;
    variant: string;
    component: string;
  }>;
  recentlyMigrated: Array<{
    key: string;
    name: string;
    usage: string[];
  }>;
}

/**
 * Generate a complete migration progress report
 */
export const generateMigrationReport = (): MigrationReport => {
  const stats = getMigrationStats();
  const categories = getIconsByCategory();
  const unmigrated = getUnmigratedIcons();
  
  // Calculate category statistics
  const categoryStats: CategoryMigrationStatus[] = Object.entries(categories).map(([categoryName, icons]) => {
    const total = icons.length;
    const migrated = icons.filter(([, entry]) => entry.migrated).length;
    const remaining = total - migrated;
    const percentage = total > 0 ? Math.round((migrated / total) * 100) : 0;
    
    return {
      category: categoryName,
      total,
      migrated,
      remaining,
      percentage,
      icons: icons.map(([key, entry]) => ({
        key,
        name: entry.name,
        migrated: entry.migrated,
        usage: entry.usage,
      })),
    };
  });
  
  // Calculate variant statistics
  const variantStats = {
    blood: Object.values(iconRegistry).filter(e => e.variant === 'blood' && e.migrated).length,
    arcane: Object.values(iconRegistry).filter(e => e.variant === 'arcane' && e.migrated).length,
    soul: Object.values(iconRegistry).filter(e => e.variant === 'soul' && e.migrated).length,
    relic: Object.values(iconRegistry).filter(e => e.variant === 'relic' && e.migrated).length,
    neutral: Object.values(iconRegistry).filter(e => e.variant === 'neutral' && e.migrated).length,
  };
  
  // Get recently migrated icons (those with usage locations)
  const recentlyMigrated = Object.entries(iconRegistry)
    .filter(([, entry]) => entry.migrated && entry.usage.length > 0)
    .map(([key, entry]) => ({
      key,
      name: entry.name,
      usage: entry.usage,
    }));
  
  return {
    timestamp: new Date().toISOString(),
    overall: stats,
    byCategory: categoryStats,
    byVariant: variantStats,
    unmigrated: unmigrated.map(icon => ({
      key: icon.key,
      name: icon.name,
      variant: icon.variant,
      component: icon.component.name,
    })),
    recentlyMigrated,
  };
};

/**
 * Format migration report as markdown
 */
export const formatMigrationReportAsMarkdown = (report: MigrationReport): string => {
  const lines: string[] = [];
  
  lines.push('# Gothic Icon Migration Progress Report');
  lines.push('');
  lines.push(`Generated: ${new Date(report.timestamp).toLocaleString()}`);
  lines.push('');
  
  // Overall progress
  lines.push('## Overall Progress');
  lines.push('');
  lines.push(`**${report.overall.migrated}** of **${report.overall.total}** icons migrated (**${report.overall.percentage}%**)`);
  lines.push('');
  lines.push('```');
  lines.push(generateProgressBar(report.overall.percentage));
  lines.push('```');
  lines.push('');
  
  // Category breakdown
  lines.push('## Progress by Category');
  lines.push('');
  lines.push('| Category | Migrated | Total | Progress |');
  lines.push('|----------|----------|-------|----------|');
  
  report.byCategory.forEach(cat => {
    const bar = generateProgressBar(cat.percentage, 10);
    lines.push(`| ${cat.category} | ${cat.migrated}/${cat.total} | ${cat.total} | ${bar} ${cat.percentage}% |`);
  });
  lines.push('');
  
  // Variant breakdown
  lines.push('## Progress by Variant');
  lines.push('');
  lines.push('| Variant | Migrated Icons |');
  lines.push('|---------|----------------|');
  lines.push(`| 🔴 Blood | ${report.byVariant.blood} |`);
  lines.push(`| 🟣 Arcane | ${report.byVariant.arcane} |`);
  lines.push(`| 🟢 Soul | ${report.byVariant.soul} |`);
  lines.push(`| 🟡 Relic | ${report.byVariant.relic} |`);
  lines.push(`| ⚪ Neutral | ${report.byVariant.neutral} |`);
  lines.push('');
  
  // Recently migrated
  if (report.recentlyMigrated.length > 0) {
    lines.push('## Recently Migrated');
    lines.push('');
    report.recentlyMigrated.forEach(icon => {
      lines.push(`- ✅ **${icon.name}**`);
      if (icon.usage.length > 0) {
        icon.usage.forEach(location => {
          lines.push(`  - Used in: \`${location}\``);
        });
      }
    });
    lines.push('');
  }
  
  // Unmigrated icons
  if (report.unmigrated.length > 0) {
    lines.push('## Remaining Icons to Migrate');
    lines.push('');
    
    // Group by category
    const unmigratedByCategory: Record<string, typeof report.unmigrated> = {};
    report.unmigrated.forEach(icon => {
      const category = icon.key.split('-')[0];
      if (!unmigratedByCategory[category]) {
        unmigratedByCategory[category] = [];
      }
      unmigratedByCategory[category].push(icon);
    });
    
    Object.entries(unmigratedByCategory).forEach(([category, icons]) => {
      lines.push(`### ${category.charAt(0).toUpperCase() + category.slice(1)}`);
      lines.push('');
      icons.forEach(icon => {
        const variantEmoji = getVariantEmoji(icon.variant);
        lines.push(`- [ ] ${variantEmoji} **${icon.name}** (\`${icon.component}\`)`);
      });
      lines.push('');
    });
  }
  
  return lines.join('\n');
};

/**
 * Format migration report as JSON
 */
export const formatMigrationReportAsJSON = (report: MigrationReport): string => {
  return JSON.stringify(report, null, 2);
};

/**
 * Format migration report as console output
 */
export const formatMigrationReportAsConsole = (report: MigrationReport): string => {
  const lines: string[] = [];
  
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('  GOTHIC ICON MIGRATION PROGRESS REPORT');
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('');
  lines.push(`  Overall: ${report.overall.migrated}/${report.overall.total} icons (${report.overall.percentage}%)`);
  lines.push('');
  lines.push(`  ${generateProgressBar(report.overall.percentage, 40)}`);
  lines.push('');
  lines.push('───────────────────────────────────────────────────────');
  lines.push('  BY CATEGORY');
  lines.push('───────────────────────────────────────────────────────');
  
  report.byCategory.forEach(cat => {
    const bar = generateProgressBar(cat.percentage, 20);
    const padding = ' '.repeat(Math.max(0, 12 - cat.category.length));
    lines.push(`  ${cat.category}${padding} ${bar} ${cat.migrated}/${cat.total}`);
  });
  
  lines.push('');
  lines.push('───────────────────────────────────────────────────────');
  lines.push('  BY VARIANT');
  lines.push('───────────────────────────────────────────────────────');
  lines.push(`  🔴 Blood:   ${report.byVariant.blood} migrated`);
  lines.push(`  🟣 Arcane:  ${report.byVariant.arcane} migrated`);
  lines.push(`  🟢 Soul:    ${report.byVariant.soul} migrated`);
  lines.push(`  🟡 Relic:   ${report.byVariant.relic} migrated`);
  lines.push(`  ⚪ Neutral: ${report.byVariant.neutral} migrated`);
  lines.push('');
  lines.push('═══════════════════════════════════════════════════════');
  
  return lines.join('\n');
};

/**
 * Generate a text-based progress bar
 */
const generateProgressBar = (percentage: number, width: number = 20): string => {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
};

/**
 * Get emoji for variant
 */
const getVariantEmoji = (variant: string): string => {
  const emojiMap: Record<string, string> = {
    blood: '🔴',
    arcane: '🟣',
    soul: '🟢',
    relic: '🟡',
    neutral: '⚪',
  };
  return emojiMap[variant] || '⚪';
};

/**
 * Get next icons to migrate (prioritized by usage frequency)
 */
export const getNextIconsToMigrate = (limit: number = 5): Array<{
  key: string;
  name: string;
  variant: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}> => {
  const unmigrated = getUnmigratedIcons();
  
  // Prioritize icons based on category and variant
  const prioritized = unmigrated.map(icon => {
    let priority: 'high' | 'medium' | 'low' = 'low';
    let reason = 'Standard icon';
    
    // High priority: Navigation and user-facing icons
    if (icon.key.startsWith('nav-') || icon.key.startsWith('user-') || icon.key.startsWith('auth-')) {
      priority = 'high';
      reason = 'Core navigation/user interface';
    }
    // Medium priority: Mode icons and actions
    else if (icon.key.startsWith('ritual-') || icon.key.startsWith('grimoire-') || icon.key.startsWith('action-')) {
      priority = 'medium';
      reason = 'Mode-specific or action icon';
    }
    // Low priority: Status and decorative
    else if (icon.key.startsWith('status-') || icon.key.startsWith('reward-')) {
      priority = 'low';
      reason = 'Status or reward indicator';
    }
    
    return {
      key: icon.key,
      name: icon.name,
      variant: icon.variant,
      priority,
      reason,
    };
  });
  
  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  prioritized.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  
  return prioritized.slice(0, limit);
};

/**
 * Export migration report to file (returns content, actual file writing should be done by caller)
 */
export const exportMigrationReport = (format: 'markdown' | 'json' | 'console' = 'markdown'): string => {
  const report = generateMigrationReport();
  
  switch (format) {
    case 'json':
      return formatMigrationReportAsJSON(report);
    case 'console':
      return formatMigrationReportAsConsole(report);
    case 'markdown':
    default:
      return formatMigrationReportAsMarkdown(report);
  }
};
