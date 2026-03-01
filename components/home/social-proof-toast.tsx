'use client';

import { useEffect, useMemo, useState } from 'react';

const MESSAGES = [
  '방금 서울의 김OO님이 사주를 확인했습니다.',
  '방금 부산의 이OO님이 연애운을 확인했습니다.',
  '방금 대전의 박OO님이 재물운 해석을 열람했습니다.',
  '방금 인천의 정OO님이 프리미엄으로 전환했습니다.',
];

export function SocialProofToast() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 3600);

    return () => clearInterval(timer);
  }, []);

  const message = useMemo(() => MESSAGES[index], [index]);

  return (
    <div className="home-social-toast" role="status" aria-live="polite">
      <span className="dot" />
      <p>{message}</p>
    </div>
  );
}
