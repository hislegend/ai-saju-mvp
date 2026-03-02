'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface UpgradeButtonProps {
  readingId: string;
}

export function UpgradeButton({ readingId }: UpgradeButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/readings/${readingId}/upgrade`, {
        method: 'POST',
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert('업그레이드에 실패했습니다.');
      }
    } catch {
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="btn"
      onClick={handleUpgrade}
      disabled={loading}
      style={{ width: '100%', cursor: loading ? 'wait' : 'pointer' }}
    >
      {loading ? '업그레이드 중...' : '내 위험 시점과 대처법 받기 — 9,900원'}
    </button>
  );
}
