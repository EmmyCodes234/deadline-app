/**
 * Migration Dashboard Component
 * 
 * Displays the current status of icon migration to the Gothic Iconography System.
 * Useful for developers to track progress and identify next icons to migrate.
 * 
 * Requirements: 6.1, 6.5
 */

import React from 'react';
import { 
  generateMigrationReport, 
  getNextIconsToMigrate,
  type MigrationReport,
  type CategoryMigrationStatus 
} from '@/utils/migrationTracker';

export const MigrationDashboard: React.FC = () => {
  const [report, setReport] = React.useState<MigrationReport | null>(null);
  const [nextIcons, setNextIcons] = React.useState<ReturnType<typeof getNextIconsToMigrate>>([]);

  React.useEffect(() => {
    const migrationReport = generateMigrationReport();
    const prioritizedIcons = getNextIconsToMigrate(10);
    
    setReport(migrationReport);
    setNextIcons(prioritizedIcons);
  }, []);

  if (!report) {
    return <div className="p-4">Loading migration status...</div>;
  }

  return (
    <div className="p-6 bg-gray-900 text-gray-100 min-h-screen font-mono">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-400 mb-2">
            Gothic Icon Migration Dashboard
          </h1>
          <p className="text-gray-400">
            Track progress of migrating icons to the Gothic Iconography System
          </p>
        </div>

        {/* Overall Progress */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-purple-500/30">
          <h2 className="text-xl font-bold text-teal-400 mb-4">Overall Progress</h2>
          
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">
                {report.overall.migrated} of {report.overall.total} icons migrated
              </span>
              <span className="text-purple-400 font-bold">
                {report.overall.percentage}%
              </span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-teal-400 h-full transition-all duration-500"
                style={{ width: `${report.overall.percentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-700/50 rounded p-3 text-center">
              <div className="text-2xl font-bold text-teal-400">
                {report.overall.total}
              </div>
              <div className="text-sm text-gray-400">Total Icons</div>
            </div>
            <div className="bg-gray-700/50 rounded p-3 text-center">
              <div className="text-2xl font-bold text-green-400">
                {report.overall.migrated}
              </div>
              <div className="text-sm text-gray-400">Migrated</div>
            </div>
            <div className="bg-gray-700/50 rounded p-3 text-center">
              <div className="text-2xl font-bold text-red-400">
                {report.overall.remaining}
              </div>
              <div className="text-sm text-gray-400">Remaining</div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-purple-500/30">
          <h2 className="text-xl font-bold text-teal-400 mb-4">Progress by Category</h2>
          
          <div className="space-y-3">
            {report.byCategory.map((category: CategoryMigrationStatus) => (
              <div key={category.category} className="bg-gray-700/30 rounded p-3">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300 capitalize">{category.category}</span>
                  <span className="text-purple-400">
                    {category.migrated}/{category.total} ({category.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-purple-500 h-full transition-all duration-300"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Variant Breakdown */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-purple-500/30">
          <h2 className="text-xl font-bold text-teal-400 mb-4">Progress by Variant</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-red-900/20 border border-red-500/30 rounded p-4 text-center">
              <div className="text-3xl mb-2">🔴</div>
              <div className="text-2xl font-bold text-red-400">
                {report.byVariant.blood}
              </div>
              <div className="text-sm text-gray-400">Blood</div>
            </div>
            
            <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4 text-center">
              <div className="text-3xl mb-2">🟣</div>
              <div className="text-2xl font-bold text-purple-400">
                {report.byVariant.arcane}
              </div>
              <div className="text-sm text-gray-400">Arcane</div>
            </div>
            
            <div className="bg-teal-900/20 border border-teal-500/30 rounded p-4 text-center">
              <div className="text-3xl mb-2">🟢</div>
              <div className="text-2xl font-bold text-teal-400">
                {report.byVariant.soul}
              </div>
              <div className="text-sm text-gray-400">Soul</div>
            </div>
            
            <div className="bg-amber-900/20 border border-amber-500/30 rounded p-4 text-center">
              <div className="text-3xl mb-2">🟡</div>
              <div className="text-2xl font-bold text-amber-400">
                {report.byVariant.relic}
              </div>
              <div className="text-sm text-gray-400">Relic</div>
            </div>
            
            <div className="bg-gray-700/20 border border-gray-500/30 rounded p-4 text-center">
              <div className="text-3xl mb-2">⚪</div>
              <div className="text-2xl font-bold text-gray-400">
                {report.byVariant.neutral}
              </div>
              <div className="text-sm text-gray-400">Neutral</div>
            </div>
          </div>
        </div>

        {/* Next Icons to Migrate */}
        {nextIcons.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/30">
            <h2 className="text-xl font-bold text-teal-400 mb-4">
              Next Icons to Migrate (Prioritized)
            </h2>
            
            <div className="space-y-3">
              {nextIcons.map((icon, index) => {
                const priorityColor = 
                  icon.priority === 'high' ? 'text-red-400' :
                  icon.priority === 'medium' ? 'text-amber-400' :
                  'text-green-400';
                
                const priorityBg = 
                  icon.priority === 'high' ? 'bg-red-900/20 border-red-500/30' :
                  icon.priority === 'medium' ? 'bg-amber-900/20 border-amber-500/30' :
                  'bg-green-900/20 border-green-500/30';
                
                return (
                  <div 
                    key={icon.key} 
                    className={`${priorityBg} border rounded p-4`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-gray-500 font-mono text-sm">
                            #{index + 1}
                          </span>
                          <span className="font-bold text-gray-200">
                            {icon.name}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${priorityColor} border border-current`}>
                            {icon.priority}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 mb-1">
                          Key: <code className="text-purple-400">{icon.key}</code>
                        </div>
                        <div className="text-sm text-gray-400">
                          Variant: <span className="text-teal-400">{icon.variant}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          {icon.reason}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Last updated: {new Date(report.timestamp).toLocaleString()}</p>
          <p className="mt-2">
            Run <code className="text-purple-400">npm run migration-report</code> to generate a detailed report
          </p>
        </div>
      </div>
    </div>
  );
};

export default MigrationDashboard;
