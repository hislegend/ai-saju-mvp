import { notFound } from 'next/navigation';
import { ReadingForm } from '@/components/forms/reading-form';
import { SocialProofTicker } from '@/components/common/social-proof-ticker';
import { CountdownBanner } from '@/components/common/countdown-banner';
import { PageTracker } from '@/components/common/page-tracker';
import { StickyCta } from '@/components/common/sticky-cta';
import { PREMIUM_PRODUCTS } from '@/lib/products';

type PremiumPageProps = {
  params: Promise<{ slug: string }>;
};

function toKrw(value: number) {
  return new Intl.NumberFormat('ko-KR').format(value);
}

export async function generateMetadata({ params }: PremiumPageProps) {
  const { slug } = await params;
  const product = PREMIUM_PRODUCTS[slug];

  if (!product) {
    return {
      title: '프리미엄 리포트',
    };
  }

  return {
    title: product.title,
    description: product.description,
  };
}

export default async function PremiumDetailPage({ params }: PremiumPageProps) {
  const { slug } = await params;
  const product = PREMIUM_PRODUCTS[slug];

  if (!product) {
    notFound();
  }

  return (
    <>
      <PageTracker eventName="landing_view" metadata={{ page: 'premium', slug: product.slug }} />
      <SocialProofTicker />

      <section className="section">
        <div className="container grid" style={{ gap: '1rem' }}>
          <article
            className="premium-hero"
            style={{
              background: `linear-gradient(125deg, ${product.heroPalette[0]}, #fff, ${product.heroPalette[1]})`,
            }}
          >
            <p className="badge">PREMIUM REPORT</p>
            <h1 className="section-title" style={{ marginTop: '0.7rem', marginBottom: '0.55rem' }}>
              {product.title}
            </h1>
            <p className="section-copy" style={{ marginBottom: '1rem' }}>
              {product.subtitle}
            </p>

            <div className="grid grid-2" style={{ alignItems: 'center' }}>
              <div>
                <p>
                  <strong style={{ fontSize: '1.3rem' }}>{toKrw(product.salePrice)}원</strong>
                  <span className="muted" style={{ marginLeft: '0.5rem', textDecoration: 'line-through' }}>
                    {toKrw(product.price)}원
                  </span>
                </p>
                <p className="helper" style={{ marginTop: '0.25rem' }}>
                  무료 요약 대비 확장 분석 + MBTI 맞춤 실행 시나리오 포함
                </p>
              </div>
              <CountdownBanner hours={12} />
            </div>
          </article>

          <div className="grid grid-2">
            <article className="card card-pad">
              <p className="eyebrow">Why This</p>
              <h2 className="section-title" style={{ marginBottom: '0.55rem' }}>
                리포트 구성
              </h2>
              <p className="section-copy" style={{ marginBottom: '0.85rem' }}>
                {product.description}
              </p>
              <ul className="list-clean">
                {product.content.map((block) => (
                  <li key={block.id}>
                    <strong>{block.title}</strong>
                    <br />
                    <span className="muted">{block.body}</span>
                  </li>
                ))}
              </ul>

              <div className="notice" style={{ marginTop: '1rem' }}>
                결제 후에도 마이페이지에서 재조회 가능합니다. 리딤코드 사용자는 결제 없이 처리 페이지로 이동합니다.
              </div>
            </article>

            <ReadingForm
              mode="premium"
              productSlug={product.slug}
              formId="premium-reading-form"
              title="프리미엄 결과 생성"
              description="입력 완료 후 결제 또는 리딤코드로 결과를 확인할 수 있습니다."
              submitLabel={product.ctaText}
            />
          </div>
        </div>
      </section>

      <StickyCta href="#premium-reading-form" label="프리미엄 결과 생성하기" />
    </>
  );
}
