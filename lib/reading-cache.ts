/**
 * 결과 캐싱 모듈 (JSON 파일 기반)
 * 동일 입력에 대해 24시간 캐시
 */

import { createHash } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { AIReadingResult } from './ai-interpreter';

const CACHE_DIR = join(process.cwd(), '.cache', 'readings');
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24시간

type CacheKey = {
  name: string;
  birthDate: string;
  birthTime: string;
  mbtiType: string;
  character: string;
};

type CacheEntry = {
  result: AIReadingResult;
  createdAt: number;
};

function hashKey(key: CacheKey): string {
  const raw = `${key.name}|${key.birthDate}|${key.birthTime}|${key.mbtiType}|${key.character}`;
  return createHash('sha256').update(raw).digest('hex').slice(0, 16);
}

function ensureCacheDir() {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
}

export function getCachedResult(key: CacheKey): AIReadingResult | null {
  try {
    ensureCacheDir();
    const filePath = join(CACHE_DIR, `${hashKey(key)}.json`);
    if (!existsSync(filePath)) return null;

    const data = JSON.parse(readFileSync(filePath, 'utf-8')) as CacheEntry;
    if (Date.now() - data.createdAt > CACHE_TTL_MS) return null;

    return data.result;
  } catch {
    return null;
  }
}

export function setCachedResult(key: CacheKey, result: AIReadingResult): void {
  try {
    ensureCacheDir();
    const filePath = join(CACHE_DIR, `${hashKey(key)}.json`);
    const entry: CacheEntry = { result, createdAt: Date.now() };
    writeFileSync(filePath, JSON.stringify(entry), 'utf-8');
  } catch (error) {
    console.error('[reading-cache] 캐시 저장 실패:', error);
  }
}
