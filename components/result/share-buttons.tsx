'use client';

import { useEffect, useMemo, useState } from 'react';
import { trackEvent } from '@/lib/client-track';

type ShareButtonsProps = {
  readingId: string;
  userName?: string;
  score?: number;
  coreSummary?: string;
};

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: {
        sendDefault: (payload: Record<string, unknown>) => void;
      };
    };
  }
}

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

export function ShareButtons({ readingId, userName = '나', score = 0, coreSummary = 'AI 사주 결과를 확인해보세요.' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return window.location.href;
  }, []);

  useEffect(() => {
    if (!KAKAO_JS_KEY || typeof window === 'undefined') return;

    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_JS_KEY);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';
    script.async = true;
    script.onload = () => {
      if (!window.Kakao) return;
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_JS_KEY);
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const encodedUrl = encodeURIComponent(shareUrl);
  const tweetText = `${userName}님의 AI 사주 결과 · 총운 ${Math.round(score)}점\n${coreSummary}`;
  const encodedTweetText = encodeURIComponent(tweetText);

  async function onCopy() {
    if (!shareUrl) return;

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);

    void trackEvent({
      eventName: 'share_clicked',
      readingId,
      metadata: { method: 'copy' },
    });
  }

  function onClickTwitter() {
    void trackEvent({
      eventName: 'share_clicked',
      readingId,
      metadata: { method: 'twitter' },
    });
  }

  function onClickKakaoFallback() {
    void trackEvent({
      eventName: 'share_clicked',
      readingId,
      metadata: { method: 'kakao_fallback' },
    });
  }

  function onClickKakaoSdk() {
    if (!window.Kakao || !shareUrl) {
      return;
    }

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${userName}님의 AI 사주 결과`,
        description: `총운 ${Math.round(score)}점 · ${coreSummary}`,
        imageUrl: `${window.location.origin}/api/og?readingId=${readingId}`,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '결과 보러가기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });

    void trackEvent({
      eventName: 'share_clicked',
      readingId,
      metadata: { method: 'kakao_sdk' },
    });
  }

  const canUseKakaoSdk = Boolean(KAKAO_JS_KEY && typeof window !== 'undefined' && window.Kakao);

  return (
    <div className="share-buttons">
      {canUseKakaoSdk ? (
        <button className="share-btn" type="button" onClick={onClickKakaoSdk}>
          카카오톡
        </button>
      ) : (
        <a
          className="share-btn"
          href={`https://sharer.kakao.com/talk/friends/picker/link?url=${encodedUrl}`}
          target="_blank"
          rel="noreferrer"
          onClick={onClickKakaoFallback}
        >
          카카오톡
        </a>
      )}

      <a
        className="share-btn"
        href={`https://twitter.com/intent/tweet?text=${encodedTweetText}&url=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        onClick={onClickTwitter}
      >
        트위터
      </a>

      <button className="share-btn" type="button" onClick={onCopy}>
        {copied ? '결과가 복사되었습니다!' : '링크 복사'}
      </button>
    </div>
  );
}
