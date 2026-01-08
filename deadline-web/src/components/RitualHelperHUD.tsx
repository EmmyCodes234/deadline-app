import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

interface RitualHelperHUDProps {
  lastViolation: string | null;
  summoningProgress: number;
  isActive: boolean;
}

export function RitualHelperHUD({ lastViolation, summoningProgress, isActive }: RitualHelperHUDProps) {
  const [message, setMessage] = useState('Inscribe words to fill the Soul Essence.');
  const [messageType, setMessageType] = useState<'normal' | 'error' | 'success'>('normal');

  useEffect(() => {
    if (!isActive) {
      setMessage('Inscribe words to fill the Soul Essence.');
      setMessageType('normal');
      return;
    }

    if (lastViolation) {
      setMessage(`The spirits reject "${lastViolation}". Try a synonym.`);
      setMessageType('error');
      
      // Reset after 3 seconds
      const timeout = setTimeout(() => {
        setMessage('Inscribe words to fill the Soul Essence.');
        setMessageType('normal');
      }, 3000);
      
      return () => clearTimeout(timeout);
    }

    if (summoningProgress >= 100) {
      setMessage('The ritual is complete! The entity has manifested.');
      setMessageType('success');
    } else if (summoningProgress > 0) {
      setMessage('The ritual progresses. Continue inscribing...');
      setMessageType('success');
    } else {
      setMessage('Inscribe words to fill the Soul Essence.');
      setMessageType('normal');
    }
  }, [lastViolation, summoningProgress, isActive]);

  if (!isActive) return null;

  const getIcon = () => {
    switch (messageType) {
      case 'error':
        return <Icon icon="solar:danger-bold" className="size-4 text-red-400" />;
      case 'success':
        return <Icon icon="solar:check-circle-bold" className="size-4 text-amber-400" />;
      default:
        return <Icon icon="solar:magic-stick-3-bold" className="size-4 text-purple-400" />;
    }
  };

  const getTextColor = () => {
    switch (messageType) {
      case 'error':
        return 'text-red-400';
      case 'success':
        return 'text-amber-400';
      default:
        return 'text-zinc-500';
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 animate-in fade-in duration-300">
      {getIcon()}
      <p className={`font-serif italic text-sm ${getTextColor()} transition-colors duration-300`}>
        {message}
      </p>
    </div>
  );
}
