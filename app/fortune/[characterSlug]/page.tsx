import { notFound } from 'next/navigation';
import { CharacterHero } from '@/components/fortune/character-hero';
import { CharacterInfo } from '@/components/fortune/character-info';
import { FortuneReadingForm } from '@/components/fortune/fortune-reading-form';
import { PriceCard } from '@/components/fortune/price-card';

type CharacterPageProps = {
  params: Promise<{ characterSlug: string }>;
};

type CharacterConfig = {
  slug: 'cheongun' | 'seyeon' | 'hwaryeon';
  name: string;
  specialty: string;
  image: string;
  description: string;
  points: string[];
  reviewA: string;
  reviewB: string;
  premiumProductSlug: string;
};

const CHARACTER_MAP: Record<string, CharacterConfig> = {
  cheongun: {
    slug: 'cheongun',
    name: '청운',
    specialty: '정통 사주 · 대운/신년운세',
    image: '/characters/cheongun.webp',
    description: '장기 흐름을 구조적으로 읽고, 결정 타이밍을 명확하게 제시하는 상담 스타일입니다.',
    points: ['올해 대운 상승/하락 구간', '재물 흐름과 리스크 포인트', '이직/전환 타이밍 제안', '관계 정리 우선순위', '월별 실행 체크포인트'],
    reviewA: '결정 타이밍을 구체적으로 알려줘서 바로 적용했습니다.',
    reviewB: '신년운세가 막연하지 않고 행동 계획으로 정리돼서 좋았습니다.',
    premiumProductSlug: '20022',
  },
  seyeon: {
    slug: 'seyeon',
    name: '세연',
    specialty: '연애/궁합 전문',
    image: '/characters/seyeon.webp',
    description: '감정선과 관계 패턴을 세밀하게 읽어, 실제 대화 전략까지 연결해주는 상담 스타일입니다.',
    points: ['상대와의 궁합 강/약 포인트', '관계 회복 시그널 분석', '연애 리스크 패턴 점검', '연락/고백 타이밍 추천', '관계 지속 행동 가이드'],
    reviewA: '궁합 해석이 현실적이라 관계를 다시 정리하는 데 도움이 됐어요.',
    reviewB: '연애운이 왜 막혔는지 원인을 정확히 짚어줬습니다.',
    premiumProductSlug: '70004',
  },
  hwaryeon: {
    slug: 'hwaryeon',
    name: '화련',
    specialty: '재물/사업 전문',
    image: '/characters/hwaryeon.webp',
    description: '수익 흐름과 사업 리듬을 빠르게 진단하고, 단기 실행 전략을 제안하는 상담 스타일입니다.',
    points: ['수익 상승 구간 타이밍', '지출 누수 포인트 진단', '사업 확장 우선순위', '파트너십 리스크 체크', '월별 돈 흐름 행동 플랜'],
    reviewA: '재물운 해석이 숫자 감각과 맞아서 실무에 바로 써먹었습니다.',
    reviewB: '사업 타이밍 조언이 명확해서 의사결정이 빨라졌어요.',
    premiumProductSlug: '20022',
  },
};

export async function generateMetadata({ params }: CharacterPageProps) {
  const { characterSlug } = await params;
  const character = CHARACTER_MAP[characterSlug];

  if (!character) {
    return { title: '사주방' };
  }

  return {
    title: `${character.name} 사주방`,
  };
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { characterSlug } = await params;
  const character = CHARACTER_MAP[characterSlug];

  if (!character) {
    notFound();
  }

  return (
    <main className="fortune-page">
      <CharacterHero name={character.name} specialty={character.specialty} image={character.image} />
      <div className="fortune-shell">
        <CharacterInfo description={character.description} points={character.points} />
        <PriceCard />
        <FortuneReadingForm characterName={character.name} premiumProductSlug={character.premiumProductSlug} />

        <section className="fortune-review-card">
          <h2>실제 후기</h2>
          <article>
            <p>{character.reviewA}</p>
          </article>
          <article>
            <p>{character.reviewB}</p>
          </article>
        </section>
      </div>
    </main>
  );
}
