/**
 * AI 사주 해석 모듈
 * Google Gemini 3.1 Pro를 사용하여 사주 + MBTI 기반 개인화 해석 생성
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { SajuPalza } from './saju-calendar';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export type AIReadingResult = {
  coreSummary: string;
  overallScore: number;
  sections: {
    love: { summary: string; detail: string; score: number };
    money: { summary: string; detail: string; score: number };
    career: { summary: string; detail: string; score: number };
    health: { summary: string; detail: string; score: number };
    relationship: { summary: string; detail: string; score: number };
  };
  monthlyFlow: Array<{ month: number; keyword: string; advice: string }>;
  mbtiGuide: { type: string; strengths: string; risks: string; actions: string[] };
  characterComment: string;
};

type CharacterName = '청운' | '세연' | '화련';

const CHARACTER_PROMPTS: Record<CharacterName, string> = {
  '청운': `당신은 "청운 윤태섭"입니다. 상담 경력 35년의 베테랑 명리학자입니다.
톤: 신뢰감 있고 깊이 있는 말투. 따뜻하지만 단호한 조언. "~입니다", "~하십시오" 존댓말.
특기: 신년운세, 대운 흐름, 전체적인 인생 방향 제시.`,

  '세연': `당신은 "세연보살"입니다. 연애/궁합 전문 상담사입니다.
톤: 따뜻하고 공감적인 말투. 친근하면서도 전문적. "~해요", "~거예요" 부드러운 존댓말.
특기: 연애운, 궁합, 관계 흐름, 감정적 조언.`,

  '화련': `당신은 "화련도사"입니다. 재물/사업 전문 상담사입니다.
톤: 단호하고 실용적인 말투. 핵심만 짚는 직설적 스타일. "~다", "~해라" 반말도 섞어서.
특기: 재물운, 사업운, 투자 타이밍, 실행 전략.`,
};

function buildPrompt(character: CharacterName, mbtiType: string, sajuPalza: SajuPalza, name: string, gender: string): string {
  return `${CHARACTER_PROMPTS[character]}

당신은 한국 전통 명리학(사주팔자) 전문가이자 MBTI 성격유형 분석가입니다.
사주팔자 데이터와 MBTI 유형을 기반으로 개인 맞춤 운세 해석을 제공합니다.

핵심 원칙:
1. 사주팔자의 오행 균형과 일간(일주 천간)을 중심으로 해석합니다.
2. MBTI 유형(${mbtiType})의 성격 특성을 사주 해석에 자연스럽게 녹입니다.
3. "같은 사주라도 ${mbtiType}인 당신에게는 이런 전략이 맞다"는 식으로 개인화합니다.
4. 구체적이고 실행 가능한 행동 조언을 포함합니다.
5. 한국어로 작성하되, 명리학 용어는 한글(한자) 형태로 씁니다.

다음 사용자의 사주를 해석해주세요.

이름: ${name}
성별: ${gender === 'MALE' ? '남성' : gender === 'FEMALE' ? '여성' : '기타'}
MBTI: ${mbtiType}

${sajuPalza.summary}

2026년 병오년(丙午年) 기준으로 올해의 운세를 중심으로 해석해주세요.

반드시 다음 JSON 형식으로만 응답하세요 (다른 텍스트 없이 JSON만):
{
  "coreSummary": "핵심 한 줄 요약 (50자 이내)",
  "overallScore": 0에서 100 사이 총운 점수,
  "sections": {
    "love": { "summary": "3줄 요약", "detail": "500자 이상 상세 해석. 청월당처럼 구체적이고 현실적인 조언. 스토리텔링 방식으로.", "score": 0에서 100 },
    "money": { "summary": "3줄 요약", "detail": "500자 이상 상세 해석", "score": 0에서 100 },
    "career": { "summary": "3줄 요약", "detail": "500자 이상 상세 해석", "score": 0에서 100 },
    "health": { "summary": "3줄 요약", "detail": "500자 이상 상세 해석", "score": 0에서 100 },
    "relationship": { "summary": "3줄 요약", "detail": "500자 이상 상세 해석", "score": 0에서 100 }
  },
  "monthlyFlow": [
    { "month": 1, "keyword": "키워드", "advice": "한 줄 조언" },
    { "month": 2, "keyword": "키워드", "advice": "한 줄 조언" },
    ... 12개월 전부
  ],
  "mbtiGuide": {
    "type": "${mbtiType}",
    "strengths": "${mbtiType}의 강점이 사주와 어떻게 시너지를 내는지 (200자)",
    "risks": "${mbtiType}의 약점이 사주에서 어떤 리스크로 나타나는지 (200자)",
    "actions": ["맞춤 행동 가이드 1", "맞춤 행동 가이드 2", "맞춤 행동 가이드 3"]
  },
  "characterComment": "캐릭터 톤으로 한 마디 코멘트 (100자 내외)"
}`;
}

export async function interpretSaju(input: {
  sajuPalza: SajuPalza;
  name: string;
  mbtiType: string;
  character: CharacterName;
  gender: string;
}): Promise<AIReadingResult> {
  const prompt = buildPrompt(input.character, input.mbtiType, input.sajuPalza, input.name, input.gender);

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-pro-preview',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8000,
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(prompt);
    const content = result.response.text();
    if (!content) throw new Error('AI 응답이 비어있습니다.');

    const parsed = JSON.parse(content) as AIReadingResult;

    if (!parsed.coreSummary || !parsed.sections || typeof parsed.overallScore !== 'number') {
      throw new Error('AI 응답 구조가 올바르지 않습니다.');
    }

    return parsed;
  } catch (error) {
    console.error('AI 해석 실패:', error);
    return buildFallbackResult(input.mbtiType);
  }
}

function buildFallbackResult(mbtiType: string): AIReadingResult {
  return {
    coreSummary: '현재 AI 해석 서비스가 일시적으로 지연되고 있습니다. 잠시 후 다시 시도해주세요.',
    overallScore: 70,
    sections: {
      love: { summary: '관계에서 소통이 중요한 시기입니다.', detail: '', score: 65 },
      money: { summary: '안정적인 재정 관리가 필요합니다.', detail: '', score: 70 },
      career: { summary: '새로운 기회를 모색하기 좋은 시기입니다.', detail: '', score: 72 },
      health: { summary: '규칙적인 생활 습관이 중요합니다.', detail: '', score: 68 },
      relationship: { summary: '주변 사람들과의 관계를 돌아보세요.', detail: '', score: 66 },
    },
    monthlyFlow: Array.from({ length: 12 }, (_, i) => ({
      month: i + 1, keyword: '준비', advice: '차분히 준비하는 시기입니다.',
    })),
    mbtiGuide: {
      type: mbtiType,
      strengths: `${mbtiType} 유형의 분석력이 올해 운세와 시너지를 냅니다.`,
      risks: '과도한 계획에 매몰되지 않도록 주의하세요.',
      actions: ['주간 목표 1개 설정하기', '감정 일기 쓰기', '주변에 도움 요청하기'],
    },
    characterComment: '일시적 오류로 상세 해석을 준비 중입니다. 잠시 후 다시 확인해주세요.',
  };
}
