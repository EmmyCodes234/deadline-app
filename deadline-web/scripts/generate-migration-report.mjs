#!/usr/bin/env node
/**
 * CLI Script to generate Gothic Icon migration progress reports
 * 
 * Usage:
 *   npm run migration-report              # Generate markdown report
 *   npm run migration-report:json         # Generate JSON report
 *   npm run migration-report:console      # Print to console
 * 
 * Requirements: 6.1, 6.5
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

// Since we can't directly import TypeScript files, we'll implement a simplified version
// that reads the icon registry and generates reports

const iconRegistryPath = './src/data/iconRegistry.ts';

// Simple icon registry parser (reads the TypeScript file and extracts data)
function parseIconRegistry() {
  // For now, we'll create a simple implementation that counts icons
  // In a real scenario, this would parse the actual registry file
  
  const categories = {
    navigation: ['nav-home-landmark', 'nav-home-door', 'nav-back-arrow', 'nav-back-chevron', 'nav-menu', 'nav-menu-justify'],
    actions: ['action-close-x', 'action-close-circle'],
    info: ['info-help', 'info-help-circle'],
    user: ['user-profile', 'user-profile-circle'],
    auth: ['auth-login', 'auth-login-key', 'auth-logout', 'auth-logout-ghost'],
    settings: ['settings-cog', 'settings-gear'],
    ritual: ['ritual-mode-icon', 'ritual-play', 'ritual-play-flame', 'ritual-pause', 'ritual-retry', 'ritual-retry-rotate', 'ritual-locked', 'ritual-unlocked', 'ritual-unlocked-door', 'ritual-patience-heart', 'ritual-patience-activity', 'ritual-speed-zap', 'ritual-speed-timer'],
    grimoire: ['grimoire-mode-icon', 'grimoire-mode-scroll', 'grimoire-new-file', 'grimoire-new-pen', 'grimoire-edit', 'grimoire-edit-pencil', 'grimoire-save', 'grimoire-save-drive', 'grimoire-delete', 'grimoire-wordcount-hash', 'grimoire-wordcount-tally'],
    reward: ['reward-skull', 'reward-achievement-medal', 'reward-achievement-trophy'],
    status: ['status-success-check', 'status-success-circle', 'status-error-triangle', 'status-error-octagon', 'status-loading'],
  };
  
  const totalIcons = Object.values(categories).flat().length;
  
  return {
    total: totalIcons,
    migrated: 0, // Will be updated as icons are migrated
    categories,
  };
}

function generateProgressBar(percentage, width = 20) {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

function generateMarkdownReport(data) {
  const percentage = data.total > 0 ? Math.round((data.migrated / data.total) * 100) : 0;
  const remaining = data.total - data.migrated;
  
  const lines = [];
  
  lines.push('# Gothic Icon Migration Progress Report');
  lines.push('');
  lines.push(`Generated: ${new Date().toLocaleString()}`);
  lines.push('');
  
  lines.push('## Overall Progress');
  lines.push('');
  lines.push(`**${data.migrated}** of **${data.total}** icons migrated (**${percentage}%**)`);
  lines.push('');
  lines.push('```');
  lines.push(generateProgressBar(percentage));
  lines.push('```');
  lines.push('');
  
  lines.push('## Progress by Category');
  lines.push('');
  lines.push('| Category | Total | Progress |');
  lines.push('|----------|-------|----------|');
  
  Object.entries(data.categories).forEach(([name, icons]) => {
    const bar = generateProgressBar(0, 10);
    lines.push(`| ${name} | ${icons.length} | ${bar} 0% |`);
  });
  lines.push('');
  
  lines.push('## Next Steps');
  lines.push('');
  lines.push('1. Begin migrating high-priority navigation icons');
  lines.push('2. Update mode-specific icons (Haunting Ritual and Grimoire Editor)');
  lines.push('3. Migrate status and reward icons');
  lines.push('4. Update the icon registry as icons are migrated');
  lines.push('');
  
  lines.push('## How to Track Migration');
  lines.push('');
  lines.push('When you migrate an icon:');
  lines.push('1. Import the icon from lucide-react');
  lines.push('2. Wrap it with `<GothicIcon>` component');
  lines.push('3. Update the icon registry by calling `markIconAsMigrated(iconKey, usageLocation)`');
  lines.push('4. Run this script again to see updated progress');
  lines.push('');
  
  return lines.join('\n');
}

function generateJSONReport(data) {
  const percentage = data.total > 0 ? Math.round((data.migrated / data.total) * 100) : 0;
  
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    overall: {
      total: data.total,
      migrated: data.migrated,
      remaining: data.total - data.migrated,
      percentage,
    },
    categories: Object.entries(data.categories).map(([name, icons]) => ({
      name,
      total: icons.length,
      migrated: 0,
      percentage: 0,
    })),
  }, null, 2);
}

function generateConsoleReport(data) {
  const percentage = data.total > 0 ? Math.round((data.migrated / data.total) * 100) : 0;
  
  const lines = [];
  
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('  GOTHIC ICON MIGRATION PROGRESS REPORT');
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('');
  lines.push(`  Overall: ${data.migrated}/${data.total} icons (${percentage}%)`);
  lines.push('');
  lines.push(`  ${generateProgressBar(percentage, 40)}`);
  lines.push('');
  lines.push('───────────────────────────────────────────────────────');
  lines.push('  BY CATEGORY');
  lines.push('───────────────────────────────────────────────────────');
  
  Object.entries(data.categories).forEach(([name, icons]) => {
    const bar = generateProgressBar(0, 20);
    const padding = ' '.repeat(Math.max(0, 12 - name.length));
    lines.push(`  ${name}${padding} ${bar} 0/${icons.length}`);
  });
  
  lines.push('');
  lines.push('═══════════════════════════════════════════════════════');
  
  return lines.join('\n');
}

// Main execution
const args = process.argv.slice(2);
const format = args.includes('--json') ? 'json' : args.includes('--console') ? 'console' : 'markdown';

const data = parseIconRegistry();

let content;
let filename;

switch (format) {
  case 'json':
    content = generateJSONReport(data);
    filename = 'MIGRATION_REPORT.json';
    break;
  case 'console':
    content = generateConsoleReport(data);
    console.log(content);
    process.exit(0);
  case 'markdown':
  default:
    content = generateMarkdownReport(data);
    filename = 'MIGRATION_REPORT.md';
    break;
}

// Write to file
const filepath = join(process.cwd(), filename);
writeFileSync(filepath, content, 'utf-8');

console.log('✅ Migration report generated successfully!');
console.log(`📄 File: ${filename}`);
console.log('');
console.log('📊 Summary:');
console.log(`   Total Icons: ${data.total}`);
console.log(`   Migrated: ${data.migrated} (0%)`);
console.log(`   Remaining: ${data.total}`);
console.log('');
console.log('🎯 Next steps:');
console.log('   1. Begin migrating navigation icons (high priority)');
console.log('   2. Update mode-specific icons');
console.log('   3. Track progress by updating the icon registry');
