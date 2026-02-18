import { CalendarType, Gender, ReadingMode } from '@prisma/client';
import { getMbtiTone, normalizeMbtiType } from '@/lib/mbti';

export type ReadingInput = {
  name: string;
  gender: Gender;
  calendarType: CalendarType;
  birthDate: string;
  birthTime?: string | null;
  timeUnknown: boolean;
  mbtiType?: string | null;
  mode: ReadingMode;
};

export type BuiltSection = {
  sectionType: string;
  title: string;
  content: string;
  displayOrder: number;
};

function hashValue(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  }
  return hash;
}

function pickByHash<T>(list: T[], hash: number): T {
  return list[hash % list.length];
}

const coreMessages = [
  '이번 흐름은 기반을 정리할수록 기회가 빨리 들어옵니다.',
  '작은 반복 개선이 큰 반전을 만드는 패턴이 강합니다.',
  '관계와 재물에서 동시에 선택과 집중이 필요한 시기입니다.',
  '지금은 확장보다 구조 재정비가 수익 안정에 유리합니다.',
];

const loveMessages = [
  '감정보다 기대치 조율이 연애운을 회복시키는 핵심입니다.',
  '연락 빈도보다 대화의 질이 관계 안정성을 좌우합니다.',
  '상대의 의도를 먼저 확인하면 불필요한 오해를 줄일 수 있습니다.',
  '미해결 감정 이슈를 이번 주에 한 번은 정리해야 흐름이 풀립니다.',
];

const moneyMessages = [
  '현금흐름을 주 단위로 끊어보면 누수 지점이 명확해집니다.',
  '고정비 재점검만으로도 이번 달 체감 여유가 생길 가능성이 큽니다.',
  '수익 확대보다 손실 방지 전략이 먼저 작동해야 합니다.',
  '단기 이익보다 회전율 관리가 더 큰 차이를 만듭니다.',
];

const relationMessages = [
  '협업에서는 역할 경계선이 분명할수록 마찰이 줄어듭니다.',
  '불편한 피드백을 빠르게 주고받으면 관계운이 회복됩니다.',
  '한 번의 솔직한 정리가 장기 갈등을 줄일 수 있습니다.',
  '작은 약속의 이행이 신뢰를 크게 끌어올립니다.',
];

const monthlyPoints = [
  '1주차: 정리, 2주차: 연결, 3주차: 확장, 4주차: 회수 전략이 유효합니다.',
  '초반에는 정보 수집, 중반에는 실행, 후반에는 조정이 안정적입니다.',
  '상승 구간은 2~3주차, 보수 운영은 4주차에 권장됩니다.',
  '초반 갈등 관리에 성공하면 후반 재물 흐름이 안정됩니다.',
];

export function buildReadingSections(input: ReadingInput): BuiltSection[] {
  const baseSeed = `${input.name}-${input.birthDate}-${input.birthTime ?? 'unknown'}-${input.calendarType}`;
  const hash = hashValue(baseSeed);
  const mbtiType = normalizeMbtiType(input.mbtiType);
  const tone = getMbtiTone(mbtiType);

  const coreLine = pickByHash(coreMessages, hash);
  const loveLine = pickByHash(loveMessages, hash + 7);
  const moneyLine = pickByHash(moneyMessages, hash + 13);
  const relationLine = pickByHash(relationMessages, hash + 19);
  const monthLine = pickByHash(monthlyPoints, hash + 23);

  const premiumHint =
    input.mode === ReadingMode.PREMIUM
      ? '프리미엄 분석에서는 월별 실행 포인트와 관계/재물 교차 시나리오를 확장 제공합니다.'
      : '무료 요약입니다. 프리미엄에서 월별 상세 전략을 확인할 수 있습니다.';

  return [
    {
      sectionType: 'CORE',
      title: '핵심 한 줄',
      content: `${coreLine}\n${premiumHint}`,
      displayOrder: 1,
    },
    {
      sectionType: 'LOVE',
      title: '연애 운세 포인트',
      content: loveLine,
      displayOrder: 2,
    },
    {
      sectionType: 'MONEY',
      title: '재물 운세 포인트',
      content: moneyLine,
      displayOrder: 3,
    },
    {
      sectionType: 'RELATION',
      title: '관계 운세 포인트',
      content: relationLine,
      displayOrder: 4,
    },
    {
      sectionType: 'MONTHLY',
      title: '월별 흐름',
      content: monthLine,
      displayOrder: 5,
    },
    {
      sectionType: 'MBTI_GUIDE',
      title: 'MBTI 맞춤 해석 톤',
      content: tone.voice,
      displayOrder: 6,
    },
    {
      sectionType: 'STRENGTH',
      title: '강점 활용법',
      content: tone.strengths,
      displayOrder: 7,
    },
    {
      sectionType: 'WARNING',
      title: '리스크 경고',
      content: tone.risk,
      displayOrder: 8,
    },
    {
      sectionType: 'ACTIONS',
      title: '이번 주 액션 3개',
      content: `1) ${tone.actions[0]}\n2) ${tone.actions[1]}\n3) ${tone.actions[2]}`,
      displayOrder: 9,
    },
  ];
}
