import Link from 'next/link';

type WarningItem = {
  label: string;
  text: string;
};

type CharacterWarnings = {
  title: string;
  lead: string;
  items: WarningItem[];
  ctaText: string;
};

const CHARACTER_WARNINGS: Record<string, CharacterWarnings> = {
  cheongun: {
    title: '⚠️ 다만, 딱 3가지는 조심하셔야 합니다',
    lead: '전체 흐름은 나쁘지 않습니다만, 이 3가지를 건드리면 운이 \'새는\' 구간이 생깁니다.',
    items: [
      { label: '타이밍', text: '한 번은 서두르면 손해가 되는 구간이 보입니다.' },
      { label: '돈의 흐름', text: '돈이 \'모이는 곳\'보다 \'새는 곳\'이 더 크게 잡힙니다.' },
      { label: '사람/관계', text: '가까운 사람의 말이 판단을 흐리는 포인트가 있습니다.' },
    ],
    ctaText: '프리미엄에서 원인·날짜·대처법까지 정리해 드립니다.',
  },
  seyeon: {
    title: '💛 좋은 흐름인데요, 이 3가지만 놓치지 마세요',
    lead: '상처가 아니라 \'패턴\'을 바꾸면, 관계가 편해집니다.',
    items: [
      { label: '말의 온도', text: '진심이 전달되기 전에 오해가 생기는 타이밍이 있어요.' },
      { label: '밀당/거리', text: '가까워질수록 불안이 올라오는 구간이 보입니다.' },
      { label: '반복되는 타입', text: '비슷한 사람에게 끌리는 패턴이 한 번 더 나올 수 있어요.' },
    ],
    ctaText: '프리미엄에서 관계가 풀리는 시점 + 피해야 할 사람 타입 + 대처 문장까지 드릴게요.',
  },
  hwaryeon: {
    title: '⚠️ 돈은 \'운\'보다 \'구멍\'이 문제입니다',
    lead: '이번 운세에서 가장 큰 리스크는 \'큰 한 방\'이 아니라 작은 누수입니다.',
    items: [
      { label: '계약/결정', text: '한 번은 \'싸인\'이 손해로 이어질 수 있습니다.' },
      { label: '충동 지출', text: '스트레스성 지출로 흐름이 꺾이는 구간이 보입니다.' },
      { label: '주변 변수', text: '도와준다는 사람 때문에 비용이 늘어날 수 있습니다.' },
    ],
    ctaText: '프리미엄에서 피해야 할 선택지 TOP3 + 3개월 캘린더로 막아드립니다.',
  },
};

const DEFAULT_WARNINGS: CharacterWarnings = CHARACTER_WARNINGS.cheongun;

type WarningSectionProps = {
  characterSlug?: string | null;
  readingId: string;
};

export function WarningSection({ characterSlug, readingId }: WarningSectionProps) {
  const slug = characterSlug ?? 'cheongun';
  const warnings = CHARACTER_WARNINGS[slug] ?? DEFAULT_WARNINGS;

  return (
    <section className="warning-section">
      <h2 className="warning-title">{warnings.title}</h2>
      <p className="warning-lead">{warnings.lead}</p>

      <div className="warning-items">
        {warnings.items.map((item, index) => (
          <div className="warning-item" key={`warn-${index}`}>
            <span className="warning-label">경고등 {index + 1} — {item.label}</span>
            <p className="warning-text">{item.text}</p>
          </div>
        ))}
      </div>

      <p className="warning-cta-text">{warnings.ctaText}</p>

      <Link className="btn warning-cta-btn" href={`/premium/20022?readingId=${readingId}`}>
        내 위험 시점과 대처법 받기
      </Link>
    </section>
  );
}
