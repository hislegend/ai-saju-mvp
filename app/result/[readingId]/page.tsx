import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PageTracker } from '@/components/common/page-tracker';
import { BlurSection } from '@/components/result/blur-section';
import { CategoryCard } from '@/components/result/category-card';
import { ScoreCircle } from '@/components/result/score-circle';
import { ShareButtons } from '@/components/result/share-buttons';
import { PdfDownloadButton } from '@/components/result/pdf-download-button';
import { WarningSection } from '@/components/result/warning-section';
import { PremiumToc } from '@/components/result/premium-toc';

type ResultPageProps = {
  params: Promise<{ readingId: string }>;
};

type ScorePayload = {
  overall: number;
  sections: {
    love: number;
    money: number;
    career: number;
    health: number;
    relationship: number;
  };
};

type CategoryKey = 'LOVE' | 'MONEY' | 'CAREER' | 'HEALTH' | 'RELATIONSHIP';

const CATEGORY_META: Array<{ key: CategoryKey; icon: string; title: string; scoreKey: keyof ScorePayload['sections'] }> = [
  { key: 'LOVE', icon: '💞', title: '연애운', scoreKey: 'love' },
  { key: 'MONEY', icon: '💰', title: '재물운', scoreKey: 'money' },
  { key: 'CAREER', icon: '💼', title: '커리어운', scoreKey: 'career' },
  { key: 'HEALTH', icon: '🌿', title: '건강운', scoreKey: 'health' },
  { key: 'RELATIONSHIP', icon: '🤝', title: '관계운', scoreKey: 'relationship' },
];

export async function generateMetadata({ params }: ResultPageProps) {
  const { readingId } = await params;

  const reading = await prisma.reading.findUnique({
    where: { id: readingId },
    include: {
      profile: true,
      sections: true,
    },
  });

  if (!reading) {
    return {
      title: 'AI 사주 결과',
    };
  }

  const sectionMap = new Map(reading.sections.map((section) => [section.sectionType, section]));
  const score = parseScore(sectionMap.get('SCORE')?.content ?? '{}');
  const coreSummary = toSummaryLines(sectionMap.get('CORE')?.content ?? reading.previewText ?? '')[0] ??
    'AI 사주 결과를 확인해보세요.';
  const title = `${reading.profile.name}님의 AI 사주 결과 — 총운 ${Math.round(score.overall)}점`;

  return {
    title,
    description: coreSummary,
    openGraph: {
      type: 'website',
      title,
      description: coreSummary,
      images: [`/api/og?readingId=${readingId}`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: coreSummary,
      images: [`/api/og?readingId=${readingId}`],
    },
  };
}

function parseScore(content: string): ScorePayload {
  try {
    const parsed = JSON.parse(content) as Partial<ScorePayload>;

    return {
      overall: typeof parsed.overall === 'number' ? parsed.overall : 72,
      sections: {
        love: typeof parsed.sections?.love === 'number' ? parsed.sections.love : 70,
        money: typeof parsed.sections?.money === 'number' ? parsed.sections.money : 70,
        career: typeof parsed.sections?.career === 'number' ? parsed.sections.career : 70,
        health: typeof parsed.sections?.health === 'number' ? parsed.sections.health : 70,
        relationship: typeof parsed.sections?.relationship === 'number' ? parsed.sections.relationship : 70,
      },
    };
  } catch {
    return {
      overall: 72,
      sections: {
        love: 70,
        money: 70,
        career: 70,
        health: 70,
        relationship: 70,
      },
    };
  }
}

function toSummaryLines(raw: string): string[] {
  const compact = raw.replace(/\r/g, '').trim();
  if (!compact) return ['분석 데이터가 준비되는 중입니다.'];

  const byLine = compact
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('['));

  if (byLine.length >= 3) return byLine.slice(0, 3);

  const bySentence = compact
    .split(/(?<=[.!?다])\s+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return (bySentence.length > 0 ? bySentence : byLine).slice(0, 3);
}

function splitSummaryDetail(raw: string) {
  const compact = raw.replace(/\r/g, '').trim();
  if (!compact) {
    return {
      summary: '데이터를 준비 중입니다.',
      detail: '',
    };
  }

  const [summaryPart, ...detailParts] = compact.split('\n\n');
  return {
    summary: summaryPart.trim(),
    detail: detailParts.join('\n\n').trim(),
  };
}

function parseMbtiGuide(raw: string) {
  const lines = raw.replace(/\r/g, '').split('\n').map((line) => line.trim());
  const type = lines.find((line) => line.startsWith('[') && line.endsWith(']'))?.replace(/[\[\]]/g, '') ?? 'MBTI 맞춤 가이드';

  const strengths = lines.find((line) => line.startsWith('강점:'))?.replace('강점:', '').trim() ?? '강점 데이터 준비 중';
  const risks = lines.find((line) => line.startsWith('주의점:'))?.replace('주의점:', '').trim() ?? '주의점 데이터 준비 중';

  const actions = lines
    .filter((line) => /^\d+\./.test(line))
    .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    .slice(0, 3);

  return { type, strengths, risks, actions };
}

function parseMonthly(raw: string) {
  const lines = raw
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 12);

  return lines.map((line, index) => {
    const match = line.match(/(\d+)월\s*\[([^\]]+)\]:\s*(.*)/);
    if (!match) {
      return {
        month: index + 1,
        keyword: '흐름',
        advice: line,
      };
    }

    return {
      month: Number(match[1]),
      keyword: match[2],
      advice: match[3],
    };
  });
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { readingId } = await params;

  const reading = await prisma.reading.findUnique({
    where: { id: readingId },
    include: {
      profile: true,
      mbtiProfile: true,
      sections: {
        orderBy: {
          displayOrder: 'asc',
        },
      },
      orders: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  });

  if (!reading) {
    notFound();
  }

  const sectionMap = new Map(reading.sections.map((section) => [section.sectionType, section]));
  const coreText = sectionMap.get('CORE')?.content ?? reading.previewText ?? '오늘 운의 흐름이 점차 상승하는 날입니다.';
  const score = parseScore(sectionMap.get('SCORE')?.content ?? '{}');
  const monthly = parseMonthly(sectionMap.get('MONTHLY')?.content ?? '');
  const mbtiGuide = parseMbtiGuide(sectionMap.get('MBTI_GUIDE')?.content ?? '');
  const characterComment = sectionMap.get('CHARACTER_COMMENT')?.content ?? '지금의 리듬을 지키면 좋은 결과가 이어집니다.';

  const isPremiumCompleted = reading.mode === 'PREMIUM' && reading.status === 'COMPLETED';
  const isPremiumLocked = reading.mode === 'PREMIUM' && reading.status !== 'COMPLETED';
  const shouldBlurDetail = reading.mode === 'QUICK' || isPremiumLocked;

  return (
    <>
      <PageTracker eventName="result_viewed" readingId={reading.id} metadata={{ status: reading.status }} />
      <section className="result-v2">
        <div className="result-v2-shell">
          <article className="result-top-card">
            <p className="result-top-name">{reading.profile.name}님의 오늘 운세</p>
            <h1>{toSummaryLines(coreText)[0] ?? coreText}</h1>
            <div className="result-top-meta">
              <span>{reading.mbtiProfile?.mbtiType ?? 'MBTI 미입력'}</span>
              <span>{reading.mode === 'PREMIUM' ? '프리미엄 리딩' : '무료 1분 리딩'}</span>
            </div>
          </article>

          <article className="result-score-card">
            <ScoreCircle score={score.overall} />
            <div className="result-bars">
              {CATEGORY_META.map((item) => (
                <div key={`bar-${item.key}`} className="result-bar-item">
                  <p>{item.title}</p>
                  <progress value={score.sections[item.scoreKey]} max={100} />
                  <span>{Math.round(score.sections[item.scoreKey])}점</span>
                </div>
              ))}
            </div>
          </article>

          <div className="result-card-grid">
            {CATEGORY_META.map((item) => {
              const section = sectionMap.get(item.key);
              const content = splitSummaryDetail(section?.content ?? '');

              return (
                <CategoryCard
                  key={item.key}
                  title={item.title}
                  icon={item.icon}
                  score={score.sections[item.scoreKey]}
                  summaryLines={toSummaryLines(content.summary)}
                  detailText={isPremiumCompleted ? content.detail : null}
                />
              );
            })}
          </div>

          {shouldBlurDetail ? (
            <>
              <WarningSection characterSlug={reading.productSlug} readingId={reading.id} />
              <PremiumToc readingId={reading.id} />
            </>
          ) : null}

          {shouldBlurDetail ? (
            <BlurSection title="월별 흐름">
              <div className="monthly-grid">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div className="monthly-item" key={`monthly-blur-${index}`}>
                    <p>{index + 1}월</p>
                    <strong>분석 중</strong>
                  </div>
                ))}
              </div>
            </BlurSection>
          ) : (
            <section className="detail-card">
              <h2>월별 흐름</h2>
              <div className="monthly-grid">
                {monthly.map((item) => (
                  <div className="monthly-item" key={`monthly-${item.month}`}>
                    <p>{item.month}월</p>
                    <strong>{item.keyword}</strong>
                    <span>{item.advice}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {shouldBlurDetail ? (
            <BlurSection title="MBTI 맞춤 가이드">
              <article className="detail-card">
                <h2>MBTI 맞춤 가이드</h2>
                <div className="mbti-badge">{mbtiGuide.type}</div>
                <p>강점: {mbtiGuide.strengths}</p>
                <p>주의점: {mbtiGuide.risks}</p>
              </article>
            </BlurSection>
          ) : (
            <article className="detail-card">
              <h2>MBTI 맞춤 가이드</h2>
              <div className="mbti-badge">{mbtiGuide.type}</div>
              <p>강점: {mbtiGuide.strengths}</p>
              <p>주의점: {mbtiGuide.risks}</p>
              <ul>
                {mbtiGuide.actions.map((action, index) => (
                  <li key={`action-${index}`}>{action}</li>
                ))}
              </ul>
            </article>
          )}

          {shouldBlurDetail ? (
            <BlurSection title="상담사 한 마디">
              <article className="character-card">
                <p className="character-chip">청운 상담사</p>
                <blockquote>{characterComment}</blockquote>
              </article>
            </BlurSection>
          ) : (
            <article className="character-card">
              <p className="character-chip">청운 상담사</p>
              <blockquote>{characterComment}</blockquote>
            </article>
          )}

          {isPremiumCompleted ? <PdfDownloadButton /> : null}

          {isPremiumLocked ? (
            <article className="result-alert">
              프리미엄 전체 결과는 결제 완료 후 열람됩니다.{' '}
              <Link href={`/checkout/${reading.id}`}>결제 페이지로 이동</Link>
            </article>
          ) : null}
        </div>
      </section>

      <div className="result-bottom-fixed">
        <div className="result-bottom-shell">
          <ShareButtons
            readingId={reading.id}
            userName={reading.profile.name}
            score={score.overall}
            coreSummary={toSummaryLines(coreText)[0] ?? coreText}
          />
          <Link className="btn" href={`/premium/20022?readingId=${reading.id}`}>
            내 위험 시점과 대처법 받기 — 9,900원
          </Link>
          <p className="price-anchor-text">1:1 사주 상담 5~20만원 대비, 리포트 9,900원</p>
        </div>
      </div>
    </>
  );
}
