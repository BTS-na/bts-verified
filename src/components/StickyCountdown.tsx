import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface StickyCountdownProps {
  expiresAt?: string | null;
  orderId?: string;
}

export const StickyCountdown = ({ expiresAt, orderId }: StickyCountdownProps) => {
  const [remaining, setRemaining] = useState<string>('30:00');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!expiresAt) {
      // Set default 30 minutes from now
      const defaultExpiry = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      const tick = () => {
        const diff = new Date(defaultExpiry).getTime() - Date.now();
        if (diff <= 0) {
          setRemaining('00:00');
          setIsActive(false);
          return;
        }
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setRemaining(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      };
      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    } else {
      const tick = () => {
        const diff = new Date(expiresAt).getTime() - Date.now();
        if (diff <= 0) {
          setRemaining('00:00');
          setIsActive(false);
          return;
        }
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setRemaining(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      };
      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    }
  }, [expiresAt]);

  if (!isActive && !orderId) return null;

  return (
    <div className={`${isActive ? 'bg-amber-50 border-b border-amber-200' : 'bg-red-50 border-b border-red-200'} py-3 px-4`}>
      <div className="mx-auto max-w-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className={`relative flex h-5 w-5 ${isActive ? 'animate-pulse' : ''}`}>
            <Clock className={`h-5 w-5 ${isActive ? 'text-amber-600' : 'text-red-600'}`} />
          </div>
          <span className={`text-sm font-bold ${isActive ? 'text-amber-900' : 'text-red-900'}`}>
            {isActive ? 'Complete Payment' : 'Payment Expired'}
          </span>
        </div>
        <div className={`text-lg font-black tabular-nums ${isActive ? 'text-amber-700' : 'text-red-700'}`}>
          {remaining}
        </div>
      </div>
      {orderId && (
        <div className={`text-xs text-center mt-2 ${isActive ? 'text-amber-700' : 'text-red-700'}`}>
          Order ID: <span className="font-mono font-bold">{orderId}</span>
        </div>
      )}
    </div>
  );
};
