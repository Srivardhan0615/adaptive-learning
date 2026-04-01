import { useEffect, useMemo, useState } from 'react';

export default function Timer({
  duration,
  onComplete,
  resetKey,
}: {
  duration: number;
  onComplete: () => void;
  resetKey: string;
}) {
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    setRemaining(duration);
  }, [duration, resetKey]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          onComplete();
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [onComplete, resetKey]);

  const strokeOffset = useMemo(() => {
    const radius = 26;
    const circumference = 2 * Math.PI * radius;
    return circumference - (remaining / duration) * circumference;
  }, [duration, remaining]);

  return (
    <div className={`relative h-16 w-16 ${remaining < 10 ? 'animate-pulse' : ''}`}>
      <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" stroke="rgba(143,164,145,0.25)" strokeWidth="6" fill="none" />
        <circle
          cx="32"
          cy="32"
          r="26"
          stroke={remaining < 10 ? '#e36b6b' : '#29c1ef'}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 26}
          strokeDashoffset={strokeOffset}
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center text-sm font-semibold ${remaining < 10 ? 'text-[#d85757]' : 'text-[#172519]'}`}>{remaining}s</div>
    </div>
  );
}
