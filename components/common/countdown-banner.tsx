'use client';

import { useEffect, useState } from 'react';

type CountdownBannerProps = {
  hours?: number;
};

function formatLeft(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const hour = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const minute = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const second = String(totalSec % 60).padStart(2, '0');
  return `${hour}:${minute}:${second}`;
}

export function CountdownBanner({ hours = 18 }: CountdownBannerProps) {
  const [left, setLeft] = useState(hours * 60 * 60 * 1000);

  useEffect(() => {
    const targetTime = Date.now() + hours * 60 * 60 * 1000;

    const timer = window.setInterval(() => {
      setLeft(targetTime - Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [hours]);

  return (
    <div className="countdown" role="status" aria-live="polite">
      오늘 한정 할인 마감까지 <strong>{formatLeft(left)}</strong>
    </div>
  );
}
