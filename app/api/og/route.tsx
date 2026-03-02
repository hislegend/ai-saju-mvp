import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

function parseScore(content?: string | null) {
  if (!content) return 72;

  try {
    const parsed = JSON.parse(content) as { overall?: number };
    return typeof parsed.overall === 'number' ? Math.max(0, Math.min(100, Math.round(parsed.overall))) : 72;
  } catch {
    return 72;
  }
}

function getCoreSummary(content?: string | null) {
  if (!content) return 'AI가 읽어주는 오늘의 운세 리딩';
  return content.split('\n').map((line) => line.trim()).filter(Boolean)[0] ?? 'AI가 읽어주는 오늘의 운세 리딩';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const readingId = searchParams.get('readingId');

  if (!readingId) {
    return new Response('readingId is required', { status: 400 });
  }

  const reading = await prisma.reading.findUnique({
    where: { id: readingId },
    include: {
      profile: true,
      mbtiProfile: true,
      sections: true,
    },
  });

  if (!reading) {
    return new Response('Not found', { status: 404 });
  }

  const sectionMap = new Map(reading.sections.map((section) => [section.sectionType, section]));
  const score = parseScore(sectionMap.get('SCORE')?.content);
  const summary = getCoreSummary(sectionMap.get('CORE')?.content ?? reading.previewText);
  const mbtiType = reading.mbtiProfile?.mbtiType ?? 'MBTI 미입력';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(145deg, #1A1A2E 0%, #121225 65%, #0F0F1E 100%)',
          color: '#F8E7BE',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          fontFamily: 'sans-serif',
          padding: '52px 56px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '190px',
            height: '100%',
            borderRadius: '28px',
            border: '1px solid rgba(212,168,83,0.4)',
            background: 'rgba(255,255,255,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '72px',
          }}
        >
          🔮
        </div>

        <div
          style={{
            width: '860px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingLeft: '28px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ margin: 0, fontSize: '28px', color: '#D4A853' }}>AI SAJU RESULT</p>
            <h1 style={{ margin: 0, fontSize: '62px', lineHeight: 1.15, color: '#FFE3A0' }}>{reading.profile.name}님의 2026년 운세</h1>
            <p style={{ margin: 0, fontSize: '34px', color: '#F7F0DB' }}>{summary}</p>
          </div>

          <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            <div
              style={{
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #E8BD5C, #D4A853)',
                color: '#27190D',
                fontSize: '34px',
                fontWeight: 700,
                padding: '12px 22px',
              }}
            >
              총운 {score}점
            </div>

            <div
              style={{
                borderRadius: '999px',
                border: '1px solid rgba(212,168,83,0.5)',
                background: 'rgba(255,255,255,0.06)',
                color: '#FFE8B2',
                fontSize: '30px',
                fontWeight: 700,
                padding: '12px 22px',
              }}
            >
              {mbtiType}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
