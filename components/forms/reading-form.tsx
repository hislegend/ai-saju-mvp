'use client';

import { FormEvent, useMemo, useState } from 'react';
import { mbtiTypes } from '@/lib/mbti';
import { trackEvent } from '@/lib/client-track';
import { MbtiMiniQuiz } from '@/components/forms/mbti-mini-quiz';

type ReadingFormProps = {
  mode: 'quick' | 'premium';
  productSlug?: string;
  formId?: string;
  submitLabel?: string;
  title?: string;
  description?: string;
};

function formatBirthDate(dateValue: string) {
  if (!dateValue) return '';
  const [year, month, day] = dateValue.split('-');
  if (!year || !month || !day) return '';
  return `${year}.${month}.${day}`;
}

export function ReadingForm({
  mode,
  productSlug,
  formId,
  submitLabel,
  title = '사주 입력',
  description = '이름/성별/생년월일을 입력하면 즉시 결과를 생성합니다.',
}: ReadingFormProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [mbtiType, setMbtiType] = useState('');
  const [mbtiConfidence, setMbtiConfidence] = useState<number | null>(null);
  const [additionalAnswers, setAdditionalAnswers] = useState<Record<string, string> | null>(null);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [showMiniQuiz, setShowMiniQuiz] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formStarted, setFormStarted] = useState(false);

  const selectedMbti = useMemo(() => mbtiType.toUpperCase(), [mbtiType]);

  function markFormStarted() {
    if (formStarted) return;

    setFormStarted(true);
    void trackEvent({
      eventName: 'form_started',
      metadata: {
        mode,
      },
    });
  }

  function collectUtm() {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('utm_source') || undefined,
      medium: params.get('utm_medium') || undefined,
      campaign: params.get('utm_campaign') || undefined,
      term: params.get('utm_term') || undefined,
      content: params.get('utm_content') || undefined,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!birthDate) {
      setError('생년월일을 입력해주세요.');
      return;
    }

    if (!timeUnknown && !birthTime) {
      setError('태어난 시간을 모르시면 "시간 모름"을 체크해주세요.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/readings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          gender,
          calendarType,
          birthDate: formatBirthDate(birthDate),
          birthTime: timeUnknown ? null : birthTime,
          timeUnknown,
          mbtiType: selectedMbti || null,
          mbtiConfidence: mbtiConfidence || undefined,
          additionalAnswers: additionalAnswers || undefined,
          marketingConsent,
          sourceUtm: collectUtm(),
          readingMode: mode,
          productSlug: mode === 'premium' ? productSlug || null : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError('리딩 생성에 실패했습니다. 입력값을 확인하고 다시 시도해주세요.');
        return;
      }

      window.location.assign(data.nextPath);
    } catch {
      setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card card-pad">
      <p className="eyebrow">Input</p>
      <h2 className="section-title" style={{ marginBottom: '0.45rem' }}>
        {title}
      </h2>
      <p className="section-copy" style={{ marginBottom: '1rem' }}>
        {description}
      </p>

      <form id={formId} className="reading-form" onSubmit={handleSubmit} onFocus={markFormStarted}>
        <div className="form-grid">
          <div className="form-group">
            <label className="label" htmlFor="name">
              이름
            </label>
            <input
              id="name"
              className="input"
              type="text"
              maxLength={40}
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="gender">
              성별
            </label>
            <select
              id="gender"
              className="select"
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
            >
              <option value="female">여성</option>
              <option value="male">남성</option>
              <option value="other">기타</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label" htmlFor="calendarType">
              달력 기준
            </label>
            <select
              id="calendarType"
              className="select"
              value={calendarType}
              onChange={(e) => setCalendarType(e.target.value as 'solar' | 'lunar')}
            >
              <option value="solar">양력</option>
              <option value="lunar">음력</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label" htmlFor="birthDate">
              생년월일
            </label>
            <input
              id="birthDate"
              className="input"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="birthTime">
              태어난 시간
            </label>
            <input
              id="birthTime"
              className="input"
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              disabled={timeUnknown}
              required={!timeUnknown}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="mbtiType">
              MBTI
            </label>
            <select
              id="mbtiType"
              className="select"
              value={selectedMbti}
              onChange={(e) => {
                const value = e.target.value;
                setMbtiType(value);
                if (value) {
                  setShowMiniQuiz(false);
                  setAdditionalAnswers(null);
                }
              }}
            >
              <option value="">모름 / 선택 안함</option>
              {mbtiTypes.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group span-2" style={{ gap: '0.6rem' }}>
            <label className="check-row">
              <input
                type="checkbox"
                checked={timeUnknown}
                onChange={(e) => {
                  setTimeUnknown(e.target.checked);
                  if (e.target.checked) setBirthTime('');
                }}
              />
              태어난 시간을 모릅니다.
            </label>

            <label className="check-row">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
              />
              이벤트/프로모션 안내 수신에 동의합니다. (선택)
            </label>
          </div>
        </div>

        {!selectedMbti ? (
          <>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setShowMiniQuiz((prev) => !prev)}
              style={{ justifySelf: 'start' }}
            >
              {showMiniQuiz ? '미니 MBTI 진단 닫기' : 'MBTI 모르면 4문항 간이 진단'}
            </button>

            {showMiniQuiz ? (
              <MbtiMiniQuiz
                onResolved={({ mbtiType: resolved, confidence, answers }) => {
                  setMbtiType(resolved);
                  setMbtiConfidence(confidence);
                  setAdditionalAnswers(answers);
                  setShowMiniQuiz(false);
                }}
              />
            ) : null}
          </>
        ) : null}

        {mbtiConfidence ? (
          <p className="helper">간이 진단 신뢰도: {(mbtiConfidence * 100).toFixed(0)}%</p>
        ) : null}

        {error ? <p className="error">{error}</p> : null}

        <button className="btn" type="submit" disabled={loading}>
          {loading ? '결과 생성 중...' : submitLabel || (mode === 'premium' ? '프리미엄 결과 보러가기' : '무료 결과 보기')}
        </button>

        <p className="helper">
          결제형 서비스는 생성 후 결제 단계로 이동합니다. 무료 결과는 정책에 따라 단기 보관됩니다.
        </p>
      </form>
    </div>
  );
}
