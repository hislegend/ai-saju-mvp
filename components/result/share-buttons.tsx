'use client';

import { useMemo, useState } from 'react';
import { trackEvent } from '@/lib/client-track';

type ShareButtonsProps = {
  readingId: string;
};

export function ShareButtons({ readingId }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return window.location.href;
  }, []);

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent('AI 사주 결과를 확인해보세요.');

  async function onCopy() {
    if (!shareUrl) return;

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);

    void trackEvent({
      eventName: 'share_clicked',
      readingId,
      metadata: { method: 'copy' },
    });
  }

  function onClickShare(method: 'kakao' | 'twitter') {
    void trackEvent({
      eventName: 'share_clicked',
      readingId,
      metadata: { method },
    });
  }

  return (
    <div className="share-buttons">
      <a
        className="share-btn"
        href={`https://sharer.kakao.com/talk/friends/picker/link?url=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        onClick={() => onClickShare('kakao')}
      >
        카카오톡
      </a>
      <a
        className="share-btn"
        href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        onClick={() => onClickShare('twitter')}
      >
        트위터
      </a>
      <button className="share-btn" type="button" onClick={onCopy}>
        {copied ? '복사 완료' : '링크 복사'}
      </button>
    </div>
  );
}
