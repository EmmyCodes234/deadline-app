import { type ReaperStatus } from '../hooks/useReaper';

interface ReaperBarProps {
  progressPercentage: number;
  status: ReaperStatus;
}

export function ReaperBar({ progressPercentage, status }: ReaperBarProps) {
  const getBarColor = () => {
    switch (status) {
      case 'SAFE':
        return 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]';
      case 'WARNING':
        return 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]';
      case 'CRITICAL':
        return 'bg-red-500 shadow-[0_0_16px_rgba(239,68,68,0.6)] animate-pulse';
      case 'DEAD':
        return 'bg-red-950';
      default:
        return 'bg-emerald-500';
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-950 z-50">
      <div
        className={`h-full transition-all duration-100 ease-linear ${getBarColor()}`}
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
}
