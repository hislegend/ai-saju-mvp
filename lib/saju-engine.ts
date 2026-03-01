/**
 * 사주 엔진 — AI 기반 해석 (Gemini 3.1 Pro)
 * 기존 해시+고정 문장 로직을 완전 교체
 */

import { CalendarType, Gender, ReadingMode } from '@prisma/client';
import { calculateSajuPalza } from '@/lib/saju-calendar';
import { interpretSaju, type AIReadingResult } from '@/lib/ai-interpreter';
import { normalizeMbtiType } from '@/lib/mbti';
import { getCachedResult, setCachedResult } from '@/lib/reading-cache';

export type ReadingInput = {
  name: string;
  gender: Gender;
  calendarType: CalendarType;
  birthDate: string;
  birthTime?: string | null;
  timeUnknown: boolean;
  mbtiType?: string | null;
  mode: ReadingMode;
  character?: '청운' | '세연' | '화련';
};

export type BuiltSection = {
  sectionType: string;
  title: string;
  content: string;
  displayOrder: number;
};

function selectCharacter(mode: ReadingMode): '청운' | '세연' | '화련' {
  // 기본 캐릭터 선택 (추후 상품별 분기)
  if (mode === ReadingMode.PREMIUM) return '청운';
  return '청운';
}

function aiResultToSections(result: AIReadingResult, mode: ReadingMode): BuiltSection[] {
  const isPremium = mode === ReadingMode.PREMIUM;
  const sections: BuiltSection[] = [];
  let order = 1;

  // 핵심 한 줄
  sections.push({
    sectionType: 'CORE',
    title: '핵심 한 줄',
    content: result.coreSummary + (isPremium ? '' : '\n\n프리미엄에서 월별 상세 전략을 확인할 수 있습니다.'),
    displayOrder: order++,
  });

  // 총운 점수
  sections.push({
    sectionType: 'SCORE',
    title: '총운 점수',
    content: JSON.stringify({ overall: result.overallScore, sections: {
      love: result.sections.love.score,
      money: result.sections.money.score,
      career: result.sections.career.score,
      health: result.sections.health.score,
      relationship: result.sections.relationship.score,
    }}),
    displayOrder: order++,
  });

  // 5개 섹션
  const sectionMap: [string, string, keyof AIReadingResult['sections']][] = [
    ['LOVE', '연애운', 'love'],
    ['MONEY', '재물운', 'money'],
    ['CAREER', '직업운', 'career'],
    ['HEALTH', '건강운', 'health'],
    ['RELATIONSHIP', '대인관계', 'relationship'],
  ];

  for (const [type, title, key] of sectionMap) {
    const sec = result.sections[key];
    const content = isPremium
      ? `${sec.summary}\n\n${sec.detail}`
      : sec.summary;
    sections.push({ sectionType: type, title, content, displayOrder: order++ });
  }

  // 월별 흐름 (프리미엄만)
  if (isPremium && result.monthlyFlow?.length) {
    const monthlyContent = result.monthlyFlow
      .map((m) => `${m.month}월 [${m.keyword}]: ${m.advice}`)
      .join('\n');
    sections.push({
      sectionType: 'MONTHLY',
      title: '월별 흐름',
      content: monthlyContent,
      displayOrder: order++,
    });
  }

  // MBTI 맞춤 가이드
  if (result.mbtiGuide) {
    const guideContent = isPremium
      ? `[${result.mbtiGuide.type} 맞춤 가이드]\n\n강점: ${result.mbtiGuide.strengths}\n\n주의점: ${result.mbtiGuide.risks}\n\n실행 가이드:\n${result.mbtiGuide.actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}`
      : `[${result.mbtiGuide.type} 맞춤 가이드]\n\n강점: ${result.mbtiGuide.strengths}\n\n프리미엄에서 맞춤 행동 가이드를 확인하세요.`;
    sections.push({
      sectionType: 'MBTI_GUIDE',
      title: 'MBTI 맞춤 가이드',
      content: guideContent,
      displayOrder: order++,
    });
  }

  // 캐릭터 코멘트
  if (result.characterComment) {
    sections.push({
      sectionType: 'CHARACTER_COMMENT',
      title: '상담사 한 마디',
      content: result.characterComment,
      displayOrder: order++,
    });
  }

  return sections;
}

export async function buildReadingSections(input: ReadingInput): Promise<BuiltSection[]> {
  const mbtiType = normalizeMbtiType(input.mbtiType) || 'ENFP';
  const character = input.character || selectCharacter(input.mode);

  // 캐시 확인
  const cacheKey = { name: input.name, birthDate: input.birthDate, birthTime: input.birthTime || '', mbtiType, character };
  const cached = getCachedResult(cacheKey);
  if (cached) {
    console.log('[saju-engine] 캐시 히트');
    return aiResultToSections(cached, input.mode);
  }

  // 사주 팔자 계산
  const calType = input.calendarType === CalendarType.SOLAR ? 'solar' : 'lunar';
  const sajuPalza = calculateSajuPalza({
    birthDate: input.birthDate,
    birthTime: input.timeUnknown ? null : input.birthTime,
    calendarType: calType,
  });

  // AI 해석
  const aiResult = await interpretSaju({
    sajuPalza,
    name: input.name,
    mbtiType,
    character,
    gender: input.gender,
  });

  // 캐시 저장
  setCachedResult(cacheKey, aiResult);

  return aiResultToSections(aiResult, input.mode);
}
