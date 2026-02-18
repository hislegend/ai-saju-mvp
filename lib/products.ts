export type ProductContentBlock = {
  id: string;
  title: string;
  body: string;
};

export type ProductConfig = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'sajuPlus' | 'package' | 'compatibility';
  price: number;
  salePrice: number;
  ctaText: string;
  heroPalette: [string, string, string];
  content: ProductContentBlock[];
};

export const PREMIUM_PRODUCTS: Record<string, ProductConfig> = {
  '20022': {
    slug: '20022',
    title: '청운 윤태섭의 2026년 신년운세 총람',
    subtitle: '상담 경력 35년 명인의 신년 운 흐름 리포트',
    description: '새해의 대운, 재물 흐름, 관계 전환점을 구조적으로 분석합니다.',
    category: 'sajuPlus',
    price: 29000,
    salePrice: 19000,
    ctaText: '60년 만의 대운, 신년운세 보러 가기',
    heroPalette: ['#f4ead5', '#d4a373', '#6b2d5c'],
    content: [
      {
        id: '20022-1',
        title: '연간 흐름 분석',
        body: '2026년을 월별로 나눠 운의 상승/하락 구간을 시각화합니다.',
      },
      {
        id: '20022-2',
        title: '결정 타이밍 가이드',
        body: '이직, 투자, 관계 정리를 위한 권장 타이밍을 액션 중심으로 제시합니다.',
      },
      {
        id: '20022-3',
        title: 'MBTI 맞춤 해석',
        body: '같은 사주라도 MBTI 성향에 맞는 실행 전략과 리스크 관리법이 달라집니다.',
      },
    ],
  },
  '70004': {
    slug: '70004',
    title: '세연보살 금전 & 연애 필수 핵심 패키지',
    subtitle: '재물운 + 연애운 동시 최적화 패키지',
    description: '막힌 돈 흐름과 꼬인 관계 흐름을 한 번에 정리하는 패키지입니다.',
    category: 'package',
    price: 39000,
    salePrice: 25000,
    ctaText: '금전 & 연애운 보러가기',
    heroPalette: ['#fff6e3', '#ffb703', '#1d3557'],
    content: [
      {
        id: '70004-1',
        title: '재물 블로킹 포인트',
        body: '지출 누수와 수익 성장 정체 구간을 행동 단위로 설명합니다.',
      },
      {
        id: '70004-2',
        title: '관계 리커버리 시나리오',
        body: '관계 유형별 대화 접근법과 금지 패턴을 구체적으로 안내합니다.',
      },
      {
        id: '70004-3',
        title: '주간 실행 플랜',
        body: '이번 주 바로 실행 가능한 3가지 행동 미션을 제공합니다.',
      },
    ],
  },
};

export const DEFAULT_PRODUCT_SLUG = '20022';

export function getProductBySlug(slug?: string | null) {
  if (!slug) return PREMIUM_PRODUCTS[DEFAULT_PRODUCT_SLUG];
  return PREMIUM_PRODUCTS[slug] || PREMIUM_PRODUCTS[DEFAULT_PRODUCT_SLUG];
}
