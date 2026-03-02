import Link from 'next/link';

const PREMIUM_TOC_ITEMS = [
  { icon: '📅', title: '3개월 주의 캘린더', desc: '좋은 날/피해야 할 날을 날짜로 찍어드립니다.' },
  { icon: '🔍', title: '새는 구멍 1곳(핵심 변수)', desc: '운이 아니라 \'결정\'에서 손해 나는 지점을 잡습니다.' },
  { icon: '💸', title: '돈 새는 구간 리포트', desc: '지출/계약/충동구매에서 새는 패턴을 끊는 법.' },
  { icon: '🚫', title: '관계 주의 인물 타입', desc: '가까운 사람 중 \'에너지 뺏는\' 유형과 대응법.' },
  { icon: '🌟', title: '기회(귀인) 포착 포인트', desc: '올해 들어오는 기회가 \'어떤 형태\'로 오는지.' },
  { icon: '💼', title: '직장/사업 의사결정 가이드', desc: '바꾸기/버티기/확장하기 중 무엇이 유리한지.' },
  { icon: '💞', title: '연애·인연 타이밍', desc: '만남/관계진전/거리두기 시점 체크.' },
  { icon: '🧠', title: 'MBTI 맞춤 대응전략', desc: '같은 사주도 \'성향\'에 따라 성과가 달라지는 구간.' },
  { icon: '⛔', title: '피해야 할 선택지 TOP3', desc: '지금 하면 손해 확률이 높은 선택을 미리 제거.' },
  { icon: '📋', title: '7일 행동 플랜', desc: '읽고 끝이 아니라, 바로 실행 가능한 루틴으로 마감.' },
];

type PremiumTocProps = {
  readingId: string;
};

export function PremiumToc({ readingId }: PremiumTocProps) {
  return (
    <section className="premium-toc-section">
      <h2 className="premium-toc-title">🔒 프리미엄 리포트에 포함된 내용</h2>

      <div className="premium-toc-list">
        {PREMIUM_TOC_ITEMS.map((item, index) => (
          <div className="premium-toc-item" key={`toc-${index}`}>
            <span className="premium-toc-icon">{item.icon}</span>
            <div className="premium-toc-text">
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="premium-toc-cta">
        <Link className="btn premium-toc-btn" href={`/premium/20022?readingId=${readingId}`}>
          내 위험 시점과 대처법 받기 — 9,900원
        </Link>
        <p className="premium-toc-anchor">1:1 사주 상담 5~20만원 대비, 리포트 9,900원</p>
      </div>
    </section>
  );
}
