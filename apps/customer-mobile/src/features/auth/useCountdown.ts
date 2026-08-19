import { useEffect, useState, useCallback } from 'react';

export function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => setRemaining((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const reset = useCallback(() => setRemaining(seconds), [seconds]);

  return { remaining, isActive: remaining > 0, reset };
}