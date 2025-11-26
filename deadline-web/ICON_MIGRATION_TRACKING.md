# Icon Migration Tracking System

This document explains how to use the Gothic Icon Migration Tracking System to monitor progress as you migrate icons to the new Gothic Iconography System.

## Overview

The migration tracking system provides:
- **Icon Registry**: A centralized database of all icons in the application
- **Progress Tracking**: Automatic calculation of migration progress
- **CLI Reports**: Generate detailed migration reports from the command line
- **Dashboard UI**: Visual dashboard to view migration status in the browser

## Icon Registry

The icon registry is located at `src/data/iconRegistry.ts` and contains all 50 icons used in the DeadLine application, organized by category:

- **Navigation & Utility** (10 icons): Home, back, close, menu, info
- **Authentication & User** (8 icons): Profile, login, logout, settings
- **Haunting Ritual Mode** (13 icons): Mode icon, play, pause, retry, locked/unlocked, stats
- **Grimoire Editor Mode** (11 icons): Mode icon, new, edit, save, delete, word count
- **Rewards & Status** (8 icons): Skull score, achievements, success, error, loading

Each icon entry includes:
```typescript
{
  name: string;           // Descriptive name
  component: LucideIcon;  // The lucide-react component
  variant: GothicIconVariant; // Color variant (blood, arcane, soul, relic, neutral)
  usage: string[];        // List of components where this icon is used
  migrated: boolean;      // Whether it's been migrated to GothicIcon
}
```

## Tracking Migration Progress

### Method 1: Mark Icons as Migrated (Programmatic)

When you migrate an icon in your code, update the registry:

```typescript
import { markIconAsMigrated } from '@/data/iconRegistry';

// After migrating an icon
markIconAsMigrated('nav-home-landmark', 'DeadLineHub.tsx');
```

### Method 2: Manual Update

Edit `src/data/iconRegistry.ts` directly and set `migrated: true` for the icon:

```typescript
'nav-home-landmark': {
  name: 'DeadLine Hub (Home) - Landmark',
  component: Landmark,
  variant: 'soul',
  usage: ['DeadLineHub.tsx'],
  migrated: true, // Changed from false to true
},
```

## Generating Migration Reports

### CLI Commands

Generate reports from the command line:

```bash
# Generate markdown report (saved to MIGRATION_REPORT.md)
npm run migration-report

# Generate JSON report (saved to MIGRATION_REPORT.json)
npm run migration-report:json

# Print report to console
npm run migration-report:console
```

### Report Contents

The migration report includes:

1. **Overall Progress**: Total icons, migrated count, percentage
2. **Category Breakdown**: Progress for each icon category
3. **Variant Breakdown**: How many icons of each variant are migrated
4. **Unmigrated Icons**: List of icons still needing migration
5. **Recently Migrated**: Icons that have been migrated with usage locations

### Example Output

```
═══════════════════════════════════════════════════════
  GOTHIC ICON MIGRATION PROGRESS REPORT
═══════════════════════════════════════════════════════

  Overall: 15/50 icons (30%)

  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░

───────────────────────────────────────────────────────
  BY CATEGORY
───────────────────────────────────────────────────────
  navigation   ████████████████░░░░ 5/6
  actions      ██████████░░░░░░░░░░ 1/2
  ritual       ████░░░░░░░░░░░░░░░░ 3/13
  ...
```

## Migration Dashboard UI

View migration progress in a visual dashboard:

```typescript
import { MigrationDashboard } from '@/components/MigrationDashboard';

// Add to your dev tools or settings page
<MigrationDashboard />
```

The dashboard displays:
- Overall progress with visual progress bar
- Category-by-category breakdown
- Variant statistics with color coding
- Prioritized list of next icons to migrate

## Migration Workflow

### Step 1: Check Current Status

```bash
npm run migration-report:console
```

### Step 2: Identify Next Icon to Migrate

The report shows prioritized icons:
- **High Priority**: Navigation and user-facing icons
- **Medium Priority**: Mode-specific and action icons
- **Low Priority**: Status and decorative icons

### Step 3: Migrate the Icon

Replace the old icon implementation with GothicIcon:

**Before:**
```tsx
import { Skull } from 'lucide-react';

<Skull className="text-red-500" size={24} />
```

**After:**
```tsx
import { Skull } from 'lucide-react';
import { GothicIcon } from '@/components/GothicIcon';

<GothicIcon variant="blood" size="md" interactive aria-label="Haunting Ritual Mode">
  <Skull />
</GothicIcon>
```

### Step 4: Update the Registry

```typescript
import { markIconAsMigrated } from '@/data/iconRegistry';

markIconAsMigrated('ritual-mode-icon', 'ModeSelectionScreen.tsx');
```

### Step 5: Verify Progress

```bash
npm run migration-report:console
```

## Utility Functions

The migration tracker provides several utility functions:

```typescript
import {
  generateMigrationReport,
  getMigrationStats,
  getIconsByCategory,
  getIconsByVariant,
  getUnmigratedIcons,
  getNextIconsToMigrate,
} from '@/utils/migrationTracker';

// Get overall statistics
const stats = getMigrationStats();
// { total: 50, migrated: 15, remaining: 35, percentage: 30 }

// Get icons by category
const categories = getIconsByCategory();

// Get icons by variant
const bloodIcons = getIconsByVariant('blood');

// Get unmigrated icons
const unmigrated = getUnmigratedIcons();

// Get next icons to migrate (prioritized)
const nextIcons = getNextIconsToMigrate(5);
```

## Integration with CI/CD

You can integrate migration tracking into your CI/CD pipeline:

```yaml
# .github/workflows/icon-migration.yml
name: Icon Migration Report

on:
  push:
    branches: [main]

jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run migration-report
      - uses: actions/upload-artifact@v2
        with:
          name: migration-report
          path: MIGRATION_REPORT.md
```

## Best Practices

1. **Update as You Go**: Mark icons as migrated immediately after updating them
2. **Track Usage**: Always specify where the icon is used when marking as migrated
3. **Generate Reports Regularly**: Run reports before and after migration sessions
4. **Prioritize High-Traffic Areas**: Migrate navigation and user-facing icons first
5. **Test Visual Consistency**: Use the dashboard to verify all variants are represented
6. **Document Edge Cases**: Note any special handling in the icon's usage array

## Troubleshooting

### Icons Not Showing as Migrated

Make sure you've updated the registry:
```typescript
markIconAsMigrated('icon-key', 'ComponentName.tsx');
```

### Report Shows Wrong Count

The registry is the source of truth. Verify the `migrated` field in `src/data/iconRegistry.ts`.

### Dashboard Not Loading

Check that all imports are correct and the migration tracker utilities are accessible.

## Related Documentation

- [Gothic Icon Migration Guide](./GOTHIC_ICON_MIGRATION_GUIDE.md)
- [Icon Registry Reference](./src/data/iconRegistry.ts)
- [GothicIcon Component Documentation](./src/components/GothicIcon.md)
- [Requirements Document](./.kiro/specs/gothic-iconography-system/requirements.md)
- [Design Document](./.kiro/specs/gothic-iconography-system/design.md)
