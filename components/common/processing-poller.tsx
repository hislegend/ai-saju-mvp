'use client';

import { useEffect, useState } from 'react';

type ProcessingPollerProps = {
  readingId: string;
};

export function ProcessingPoller({ readingId }: ProcessingPollerProps) {
  const [left, setLeft] = useState(8);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          window.location.assign(`/result/${readingId}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [readingId]);

  return <p className="helper">{left}초 후 자동으로 결과 페이지를 새로고침합니다.</p>;
}
