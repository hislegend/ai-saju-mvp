/**
 * 사주 만세력 계산 모듈
 * 양력/음력 → 천간지지 → 사주 팔자 산출
 */

import KoreanLunarCalendar from 'korean-lunar-calendar';

// 천간 (Heavenly Stems)
const CHEON_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
const CHEON_GAN_KR = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;

// 지지 (Earthly Branches)
const JI_JI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
const JI_JI_KR = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;

// 오행 매핑
const OHANG_MAP: Record<string, string> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土',
  '庚': '金', '辛': '金', '壬': '水', '癸': '水',
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

// 시주 천간 계산용 (일간 기준)
const HOUR_STEM_BASE: Record<string, number> = {
  '甲': 0, '己': 0, '乙': 2, '庚': 2, '丙': 4, '辛': 4, '丁': 6, '壬': 6, '戊': 8, '癸': 8,
};

// 월주 천간 계산용 (년간 기준)
const MONTH_STEM_BASE: Record<string, number> = {
  '甲': 2, '己': 2, '乙': 4, '庚': 4, '丙': 6, '辛': 6, '丁': 8, '壬': 8, '戊': 0, '癸': 0,
};

// 시간대별 지지 매핑
const HOUR_TO_BRANCH: [number, number, string][] = [
  [23, 1, '子'], [1, 3, '丑'], [3, 5, '寅'], [5, 7, '卯'],
  [7, 9, '辰'], [9, 11, '巳'], [11, 13, '午'], [13, 15, '未'],
  [15, 17, '申'], [17, 19, '酉'], [19, 21, '戌'], [21, 23, '亥'],
];

export type Pillar = {
  stem: string; branch: string; stemKr: string; branchKr: string;
  stemElement: string; branchElement: string;
};

export type SajuPalza = {
  yearPillar: Pillar; monthPillar: Pillar; dayPillar: Pillar; hourPillar: Pillar | null;
  elementAnalysis: { wood: number; fire: number; earth: number; metal: number; water: number };
  dominantElement: string; weakElement: string;
  lunarDate: { year: number; month: number; day: number };
  summary: string;
};

function makePillar(stemIdx: number, branchIdx: number): Pillar {
  const si = ((stemIdx % 10) + 10) % 10;
  const bi = ((branchIdx % 12) + 12) % 12;
  return {
    stem: CHEON_GAN[si], branch: JI_JI[bi],
    stemKr: CHEON_GAN_KR[si], branchKr: JI_JI_KR[bi],
    stemElement: OHANG_MAP[CHEON_GAN[si]], branchElement: OHANG_MAP[JI_JI[bi]],
  };
}

function getLunarDate(year: number, month: number, day: number, calendarType: 'solar' | 'lunar') {
  if (calendarType === 'lunar') return { year, month, day };
  const cal = new KoreanLunarCalendar();
  cal.setSolarDate(year, month, day);
  const l = cal.getLunarCalendar(); return { year: l.year, month: l.month, day: l.day };
}

function getYearPillar(lunarYear: number): Pillar {
  return makePillar((lunarYear - 4) % 10, (lunarYear - 4) % 12);
}

function getMonthPillar(yearStem: string, lunarMonth: number): Pillar {
  const base = MONTH_STEM_BASE[yearStem] ?? 0;
  return makePillar((base + lunarMonth - 1) % 10, (lunarMonth + 1) % 12);
}

function getDayPillar(year: number, month: number, day: number): Pillar {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const diff = jdn - 2451551; // 2000-01-07 = 갑자일
  return makePillar(((diff % 10) + 10) % 10, ((diff % 12) + 12) % 12);
}

function getHourPillar(dayStem: string, hour: number): Pillar {
  let branchStr = '子';
  for (const [start, end, branch] of HOUR_TO_BRANCH) {
    if (start > end) { if (hour >= start || hour < end) { branchStr = branch; break; } }
    else { if (hour >= start && hour < end) { branchStr = branch; break; } }
  }
  const branchIdx = JI_JI.indexOf(branchStr as typeof JI_JI[number]);
  const base = HOUR_STEM_BASE[dayStem] ?? 0;
  return makePillar((base + branchIdx) % 10, branchIdx);
}

function analyzeElements(pillars: Pillar[]) {
  const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const map: Record<string, keyof typeof counts> = { '木': 'wood', '火': 'fire', '土': 'earth', '金': 'metal', '水': 'water' };
  for (const p of pillars) {
    const se = map[p.stemElement]; if (se) counts[se]++;
    const be = map[p.branchElement]; if (be) counts[be]++;
  }
  return counts;
}

function pillarToString(p: Pillar): string { return `${p.stem}${p.branch}(${p.stemKr}${p.branchKr})`; }

export function calculateSajuPalza(input: {
  birthDate: string; birthTime?: string | null; calendarType: 'solar' | 'lunar';
}): SajuPalza {
  const parts = input.birthDate.replace(/-/g, '.').split('.').map(Number);
  const [year, month, day] = parts;
  const lunar = getLunarDate(year, month, day, input.calendarType);
  const yearPillar = getYearPillar(lunar.year);
  const monthPillar = getMonthPillar(yearPillar.stem, lunar.month);
  const dayPillar = getDayPillar(year, month, day);
  let hourPillar: Pillar | null = null;
  if (input.birthTime) {
    const hour = parseInt(input.birthTime.split(':')[0], 10);
    if (!isNaN(hour)) hourPillar = getHourPillar(dayPillar.stem, hour);
  }
  const allPillars = [yearPillar, monthPillar, dayPillar];
  if (hourPillar) allPillars.push(hourPillar);
  const elementAnalysis = analyzeElements(allPillars);
  const entries = Object.entries(elementAnalysis) as [string, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const nameMap: Record<string, string> = { wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)' };
  const dominant = nameMap[entries[0][0]];
  const weak = nameMap[entries[entries.length - 1][0]];
  const pillarsText = [
    `년주: ${pillarToString(yearPillar)}`, `월주: ${pillarToString(monthPillar)}`,
    `일주: ${pillarToString(dayPillar)}`, hourPillar ? `시주: ${pillarToString(hourPillar)}` : '시주: 미상',
  ].join(', ');
  const elementText = entries.map(([k, v]) => `${nameMap[k]}: ${v}`).join(', ');
  const summary = `사주팔자: ${pillarsText}. 오행분석: ${elementText}. 일간: ${dayPillar.stem}(${dayPillar.stemKr}). 주요 오행: ${dominant}, 부족 오행: ${weak}.`;
  return { yearPillar, monthPillar, dayPillar, hourPillar, elementAnalysis, dominantElement: dominant, weakElement: weak, lunarDate: lunar, summary };
}
