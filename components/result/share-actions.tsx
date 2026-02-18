'use client';

import { trackEvent } from '@/lib/client-track';

type ShareActionsProps = {
  readingId: string;
};

export function ShareActions({ readingId }: ShareActionsProps) {
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  async function copyLink() {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    void trackEvent({
      eventName: 'share_clicked',
      readingId,
      metadata: {
        method: 'copy',
      },
    });
  }

  async function nativeShare() {
    if (!canShare) return;

    await navigator.share({
      title: 'AI 사주 결과',
      text: 'MBTI 맞춤 사주 결과를 확인해보세요.',
      url: window.location.href,
    });

    void trackEvent({
      eventName: 'share_clicked',
      readingId,
      metadata: {
        method: 'native',
      },
    });
  }

  return (
    <div className="share-row">
      <button className="btn-secondary" type="button" onClick={copyLink}>
        결과 링크 복사
      </button>
      {canShare ? (
        <button className="btn" type="button" onClick={nativeShare}>
          공유하기
        </button>
      ) : null}
    </div>
  );
}
