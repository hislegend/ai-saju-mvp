import type { Metadata } from 'next';
import Link from 'next/link';
import { PageTracker } from '@/components/common/page-tracker';
import { CategoryTabs } from '@/components/home/category-tabs';
import { HeroSection } from '@/components/home/hero-section';
import { ProductCard } from '@/components/home/product-card';
import { ReviewSection } from '@/components/home/review-section';
import { SocialProofToast } from '@/components/home/social-proof-toast';


export const metadata: Metadata = {
  title: 'AI 사주 랩 | 무료 1분 사주 + MBTI 맞춤 해석',
  description: '메인에서 바로 캐릭터 사주방을 선택하고 무료 1분 사주를 시작하세요.',
  openGraph: {
    type: 'website',
    title: 'AI 사주 랩 | 무료 1분 사주 + MBTI 맞춤 해석',
    description: '메인에서 바로 캐릭터 사주방을 선택하고 무료 1분 사주를 시작하세요.',
    images: ['/characters/cheongun.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 사주 랩 | 무료 1분 사주 + MBTI 맞춤 해석',
    description: '메인에서 바로 캐릭터 사주방을 선택하고 무료 1분 사주를 시작하세요.',
    images: ['/characters/cheongun.webp'],
  },
};

const PRODUCTS = [
  {
    name: '청운 사주방',
    specialty: '정통 사주 · 재물/커리어 집중',
    image: '/characters/cheongun.webp',
    slug: '20022',
    originalPrice: 19000,
    salePrice: 9900,
  },
  {
    name: '세연 사주방',
    specialty: '연애/관계 흐름 집중 해석',
    image: '/characters/seyeon.webp',
    slug: '70004',
    originalPrice: 19000,
    salePrice: 9900,
  },
  {
    name: '화련 사주방',
    specialty: '변화기 돌파 · 행동 전략',
    image: '/characters/hwaryeon.webp',
    slug: '20022',
    originalPrice: 19000,
    salePrice: 9900,
  },
];

export default function HomePage() {
  return (
    <>
      <PageTracker eventName="landing_view" metadata={{ page: 'home-v2' }} />
      <main className="home-v2">
        <HeroSection />
        <div className="home-v2-shell">
          <CategoryTabs />

          <section className="home-products" aria-label="BEST 상품">
            <div className="home-products-head">
              <p>BEST 사주방</p>
              <span>3개 추천</span>
            </div>
            <div className="home-product-list">
              {PRODUCTS.map((product) => (
                <ProductCard
                  key={product.name}
                  name={product.name}
                  specialty={product.specialty}
                  image={product.image}
                  slug={product.slug}
                  originalPrice={product.originalPrice}
                  salePrice={product.salePrice}
                />
              ))}
            </div>
          </section>

          <Link className="home-big-cta" href="/quick">
            무료 1분 사주 체험
          </Link>

          <ReviewSection />
        </div>

        <SocialProofToast />
      </main>
    </>
  );
}
