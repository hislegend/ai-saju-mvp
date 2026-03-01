'use client';

import { FormEvent, useMemo, useState } from 'react';
import { mbtiTypes } from '@/lib/mbti';

type FortuneReadingFormProps = {
  characterName: string;
  premiumProductSlug: string;
};

type SubmitMode = 'quick' | 'premium';

const BIRTH_TIME_OPTIONS = [
  { label: '자시 (23:00~00:59)', value: '23:00' },
  { label: '축시 (01:00~02:59)', value: '01:00' },
  { label: '인시 (03:00~04:59)', value: '03:00' },
  { label: '묘시 (05:00~06:59)', value: '05:00' },
  { label: '진시 (07:00~08:59)', value: '07:00' },
  { label: '사시 (09:00~10:59)', value: '09:00' },
  { label: '오시 (11:00~12:59)', value: '11:00' },
  { label: '미시 (13:00~14:59)', value: '13:00' },
  { label: '신시 (15:00~16:59)', value: '15:00' },
  { label: '유시 (17:00~18:59)', value: '17:00' },
  { label: '술시 (19:00~20:59)', value: '19:00' },
  { label: '해시 (21:00~22:59)', value: '21:00' },
];

function formatBirthDate(dateValue: string) {
  if (!dateValue) return '';
  const [year, month, day] = dateValue.split('-');
  if (!year || !month || !day) return '';
  return `${year}.${month}.${day}`;
}

export function FortuneReadingForm({ characterName, premiumProductSlug }: FortuneReadingFormProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [mbtiType, setMbtiType] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loadingMode, setLoadingMode] = useState<SubmitMode | null>(null);

  const normalizedMbtiType = useMemo(() => mbtiType.toUpperCase(), [mbtiType]);

  async function submit(mode: SubmitMode) {
    setError(null);

    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    if (!birthDate) {
      setError('생년월일을 입력해주세요.');
      return;
    }

    if (!timeUnknown && !birthTime) {
      setError('태어난 시간을 선택하거나 시간 모름을 체크해주세요.');
      return;
    }

    setLoadingMode(mode);

    try {
      const response = await fetch('/api/readings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          gender,
          calendarType,
          birthDate: formatBirthDate(birthDate),
          birthTime: timeUnknown ? null : birthTime,
          timeUnknown,
          mbtiType: normalizedMbtiType || null,
          marketingConsent: false,
          readingMode: mode,
          productSlug: mode === 'premium' ? premiumProductSlug : 'quick-free',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError('리딩 생성에 실패했습니다. 입력값을 확인해주세요.');
        return;
      }

      if (typeof data.nextPath === 'string') {
        window.location.assign(data.nextPath);
        return;
      }

      setError('이동 경로를 받지 못했습니다. 다시 시도해주세요.');
    } catch {
      setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoadingMode(null);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form className="fortune-form" onSubmit={onSubmit}>
      <h2>{characterName} 사주 입력</h2>

      <label className="fortune-label">
        이름
        <input
          type="text"
          className="fortune-input"
          maxLength={40}
          placeholder="홍길동"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      <label className="fortune-label">
        생년월일
        <input
          type="date"
          className="fortune-input"
          value={birthDate}
          onChange={(event) => setBirthDate(event.target.value)}
        />
      </label>

      <label className="fortune-label">
        성별
        <select className="fortune-input" value={gender} onChange={(event) => setGender(event.target.value as 'male' | 'female' | 'other')}>
          <option value="female">여성</option>
          <option value="male">남성</option>
          <option value="other">기타</option>
        </select>
      </label>

      <label className="fortune-label">
        태어난 시간
        <select
          className="fortune-input"
          value={birthTime}
          onChange={(event) => setBirthTime(event.target.value)}
          disabled={timeUnknown}
        >
          <option value="">선택하세요</option>
          {BIRTH_TIME_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="fortune-check">
        <input
          type="checkbox"
          checked={timeUnknown}
          onChange={(event) => {
            setTimeUnknown(event.target.checked);
            if (event.target.checked) {
              setBirthTime('');
            }
          }}
        />
        태어난 시간을 모릅니다.
      </label>

      <fieldset className="fortune-inline-options">
        <legend>달력 기준</legend>
        <label>
          <input
            type="radio"
            name="calendarType"
            value="solar"
            checked={calendarType === 'solar'}
            onChange={() => setCalendarType('solar')}
          />
          양력
        </label>
        <label>
          <input
            type="radio"
            name="calendarType"
            value="lunar"
            checked={calendarType === 'lunar'}
            onChange={() => setCalendarType('lunar')}
          />
          음력
        </label>
      </fieldset>

      <label className="fortune-label">
        MBTI
        <select className="fortune-input" value={normalizedMbtiType} onChange={(event) => setMbtiType(event.target.value)}>
          <option value="">모름</option>
          {mbtiTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      {error ? <p className="error">{error}</p> : null}

      <div className="fortune-submit-row">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => void submit('quick')}
          disabled={loadingMode !== null}
        >
          {loadingMode === 'quick' ? '생성 중...' : '무료 1분 사주 보기'}
        </button>
        <button type="button" className="btn" onClick={() => void submit('premium')} disabled={loadingMode !== null}>
          {loadingMode === 'premium' ? '생성 중...' : '프리미엄 사주 보기 — 9,900원'}
        </button>
      </div>
    </form>
  );
}
