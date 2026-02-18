'use client';

import { useEffect, useMemo, useState } from 'react';

const defaultMessages = [
  '방금 전 서울 사용자: 2026 신년운세 결제 완료',
  '3분 전 부산 사용자: 무료 1분 사주 결과 공유',
  '5분 전 인천 사용자: MBTI 맞춤 리포트 열람',
  '8분 전 대전 사용자: 리딤코드 사용 후 결과 확인',
];

type SocialProofTickerProps = {
  messages?: string[];
};

export function SocialProofTicker({ messages = defaultMessages }: SocialProofTickerProps) {
  const safeMessages = useMemo(() => (messages.length > 0 ? messages : defaultMessages), [messages]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % safeMessages.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [safeMessages.length]);

  return (
    <div className="social-proof" role="status" aria-live="polite">
      <div className="social-proof__inner">
        <span className="social-dot" aria-hidden="true" />
        <strong>실시간 구매/조회</strong>
        <span>{safeMessages[index]}</span>
      </div>
    </div>
  );
}
