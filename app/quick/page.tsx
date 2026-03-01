import { ReadingForm } from '@/components/forms/reading-form';
import { SocialProofTicker } from '@/components/common/social-proof-ticker';
import { PageTracker } from '@/components/common/page-tracker';
import { StickyCta } from '@/components/common/sticky-cta';

export const metadata = {
  title: '무료 1분 사주',
};

export default function QuickPage() {
  return (
    <>
      <PageTracker eventName="landing_view" metadata={{ page: 'quick' }} />
      <SocialProofTicker />

      <section className="section">
        <div className="container grid grid-2">
          <article className="card card-pad">
            <p className="eyebrow">지금 바로 확인</p>
            <h1 className="section-title" style={{ marginBottom: '0.6rem' }}>
              무료 1분 사주
            </h1>
            <p className="section-copy">
              결과는 즉시 생성되며, 연애/재물/관계/월별 포인트를 빠르게 확인할 수 있습니다. MBTI를 함께 입력하면
              같은 사주라도 맞춤형 톤으로 액션 가이드가 달라집니다.
            </p>
            <div className="notice" style={{ marginTop: '1rem' }}>
              무료 결과는 단기 보관 정책이 적용됩니다. 중요한 결과는 마이페이지에서 유료 버전으로 확장해 보관하세요.
            </div>
            <ul className="list-clean" style={{ marginTop: '1rem' }}>
              <li>핵심 한 줄 요약</li>
              <li>강점 활용법 + 리스크 경고</li>
              <li>이번 주 액션 3개</li>
            </ul>
          </article>

          <ReadingForm
            mode="quick"
            formId="quick-reading-form"
            title="무료 결과 생성"
            description="최소 입력만으로 바로 리딩을 만들어드립니다."
            submitLabel="무료 결과 생성"
          />
        </div>
      </section>

      <StickyCta href="#quick-reading-form" label="무료 사주 입력하기" />
    </>
  );
}
