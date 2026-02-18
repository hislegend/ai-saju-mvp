import { z } from 'zod';

export const mbtiTypes = [
  'ESTJ', 'ESTP', 'ESFJ', 'ESFP',
  'ENTJ', 'ENTP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISTP', 'ISFJ', 'ISFP',
  'INTJ', 'INTP', 'INFJ', 'INFP',
] as const;

export type MbtiType = (typeof mbtiTypes)[number];

type Axis = 'EI' | 'SN' | 'TF' | 'JP';

type ToneProfile = {
  voice: string;
  strengths: string;
  risk: string;
  actions: [string, string, string];
};

const toneMap: Record<MbtiType, ToneProfile> = {
  ESTJ: {
    voice: '현실적이고 구조적인 실행력이 오늘의 승부를 만듭니다.',
    strengths: '계획-실행-검증 루프를 빠르게 돌리면 성과가 커집니다.',
    risk: '속도를 우선하다가 관계 신호를 놓치면 반발이 쌓일 수 있습니다.',
    actions: ['지출 카테고리 3개 즉시 통제', '중요 대화는 결론보다 맥락 먼저 공유', '이번 주 1건 결과 중심 회고'],
  },
  ESTP: {
    voice: '기회 감지 속도가 강점인 주간입니다.',
    strengths: '짧은 실험을 반복하면 고효율 포인트를 빨리 찾습니다.',
    risk: '즉흥 결정이 누적되면 자금 흐름이 거칠어질 수 있습니다.',
    actions: ['24시간 룰로 충동 결제 방지', '유입-전환 데이터 1회 점검', '연락 미룬 사람 1명 먼저 연락'],
  },
  ESFJ: {
    voice: '관계의 온도를 관리할수록 운의 체감이 높아집니다.',
    strengths: '조율과 배려가 협력 운을 끌어올립니다.',
    risk: '타인 우선이 과하면 본인 에너지와 예산이 소진됩니다.',
    actions: ['도움 요청 1건 명확히 하기', '관계 지출 상한선 설정', '칭찬+요청을 한 문장으로 전달'],
  },
  ESFP: {
    voice: '표현력과 매력이 기회를 당겨오는 흐름입니다.',
    strengths: '가벼운 시도로도 반응 데이터를 잘 모읍니다.',
    risk: '즐거움 소비가 누적되면 재물운 회복이 늦어집니다.',
    actions: ['주간 소비 상위 3개 점검', '한 번에 한 약속만 확정', '성과를 SNS 공유 대신 노트 기록'],
  },
  ENTJ: {
    voice: '큰 그림을 현실로 전환하기 좋은 타이밍입니다.',
    strengths: '우선순위 재배치만으로 생산성이 크게 오릅니다.',
    risk: '강한 추진이 상대에겐 압박으로 읽힐 수 있습니다.',
    actions: ['핵심 목표 1개만 고정', '협업 요청 시 선택지 2개 제시', '고정비 절감 항목 1개 실행'],
  },
  ENTP: {
    voice: '아이디어 연결력이 수익 기회를 엽니다.',
    strengths: '새 관점을 빠르게 실험할수록 기회비용이 줄어듭니다.',
    risk: '확장만 하고 마무리하지 않으면 성과가 분산됩니다.',
    actions: ['진행 중인 실험 1개 종료', '새 아이디어는 2줄로 검증 기준 작성', '연락 누락 1건 정리'],
  },
  ENFJ: {
    voice: '영향력과 공감이 동시에 작동하는 주간입니다.',
    strengths: '사람 중심 설계가 장기적 수익과 신뢰를 만듭니다.',
    risk: '과도한 책임감이 피로를 키울 수 있습니다.',
    actions: ['도움 요청 범위를 시간 단위로 제한', '핵심 대화 전 의도 1줄 정리', '관계 우선순위 3단계로 분류'],
  },
  ENFP: {
    voice: '창의성과 감정 에너지가 상승하는 흐름입니다.',
    strengths: '새로운 연결에서 예상 밖 기회가 열립니다.',
    risk: '집중 분산으로 결론이 지연될 수 있습니다.',
    actions: ['오늘의 단일 목표 1개 고정', '5분 회고로 감정-사실 분리', '미완료 작업 1개 완료'],
  },
  ISTJ: {
    voice: '기본기와 일관성이 강한 수익 방어를 만듭니다.',
    strengths: '기록 기반 의사결정이 손실을 크게 줄입니다.',
    risk: '과거 기준 고수로 기회 진입이 늦어질 수 있습니다.',
    actions: ['월 고정비 재점검', '리스크 체크리스트 최신화', '관계 이슈는 사실-요청 형식으로 전달'],
  },
  ISTP: {
    voice: '문제 해결 감각이 빛나는 구간입니다.',
    strengths: '핵심 병목을 짧게 제거하는 능력이 강합니다.',
    risk: '감정 신호를 해석하지 않으면 오해가 남습니다.',
    actions: ['시간 낭비 요소 1개 제거', '회피한 대화 1건 10분 내 처리', '지출 자동화 설정 1개 추가'],
  },
  ISFJ: {
    voice: '안정감 있는 운영이 운의 하방을 막아줍니다.',
    strengths: '세심함이 관계 신뢰와 재방문 운을 높입니다.',
    risk: '불편한 이슈를 미루면 한 번에 부담이 커집니다.',
    actions: ['부담되는 요청 1건 정중히 거절', '예산 버퍼 계좌 분리', '주간 감정 로그 3줄 작성'],
  },
  ISFP: {
    voice: '감각과 진정성이 매력 포인트로 작동합니다.',
    strengths: '자연스러운 표현이 관계 회복에 유리합니다.',
    risk: '결정 유예가 기회를 놓치게 할 수 있습니다.',
    actions: ['이번 주 결론 내릴 일 1건 마감 설정', '비교 소비 줄이기', '가치 기준 3개 문장화'],
  },
  INTJ: {
    voice: '장기 전략이 실제 성과로 연결되기 좋은 타이밍입니다.',
    strengths: '시스템 설계로 반복 손실을 줄일 수 있습니다.',
    risk: '정답 지향이 협업 유연성을 떨어뜨릴 수 있습니다.',
    actions: ['핵심 지표 2개만 추적', '상대 관점 질문 1개 먼저 던지기', '다음 분기 역산 계획 30분 작성'],
  },
  INTP: {
    voice: '분석 깊이가 문제의 본질을 정확히 집어냅니다.',
    strengths: '가설-검증 접근이 높은 정확도를 만듭니다.',
    risk: '완벽한 이해를 기다리면 실행 타이밍을 놓칩니다.',
    actions: ['불완전해도 1차안 즉시 실행', '결정 기한 24시간 설정', '관계 이슈는 텍스트보다 통화로 1회 정리'],
  },
  INFJ: {
    voice: '통찰과 맥락 이해가 관계 운을 개선합니다.',
    strengths: '숨은 의도를 읽고 갈등 비용을 낮춥니다.',
    risk: '과몰입으로 감정 에너지 소모가 클 수 있습니다.',
    actions: ['감정 경계선 문장 1개 준비', '할 일 3개 이상은 즉시 위임 고려', '주간 회복 루틴 2회 예약'],
  },
  INFP: {
    voice: '가치 중심 선택이 장기 운을 안정화합니다.',
    strengths: '진심 기반 소통이 관계 신뢰를 높입니다.',
    risk: '현실 지표를 놓치면 실행력이 분산될 수 있습니다.',
    actions: ['가치/수익 기준 동시 체크', '하루 30분 집중 블록 확보', '불편한 피드백 1건 수용 후 액션화'],
  },
};

export function normalizeMbtiType(input?: string | null): MbtiType | null {
  if (!input) return null;
  const value = input.toUpperCase().trim();
  return (mbtiTypes as readonly string[]).includes(value)
    ? (value as MbtiType)
    : null;
}

export function getMbtiTone(type?: string | null) {
  const normalized = normalizeMbtiType(type) || 'INTJ';
  return toneMap[normalized];
}

export const mbtiResolveInputSchema = z.object({
  answers: z
    .array(
      z.object({
        axis: z.enum(['EI', 'SN', 'TF', 'JP']),
        trait: z.string().min(1).max(1),
      }),
    )
    .length(4),
});

export function resolveMbtiFromAnswers(
  answers: Array<{ axis: Axis; trait: string }>,
): { mbtiType: MbtiType; confidence: number } {
  const axisTrait: Record<Axis, string> = { EI: 'E', SN: 'S', TF: 'T', JP: 'J' };

  for (const answer of answers) {
    axisTrait[answer.axis] = answer.trait.toUpperCase();
  }

  const mbtiType = `${axisTrait.EI}${axisTrait.SN}${axisTrait.TF}${axisTrait.JP}`;
  const normalized = normalizeMbtiType(mbtiType) || 'INTJ';

  const validAnswerCount = answers.filter((answer) => answer.trait.length === 1).length;
  const confidence = Math.min(0.98, Number((0.55 + validAnswerCount * 0.1).toFixed(2)));

  return { mbtiType: normalized, confidence };
}
