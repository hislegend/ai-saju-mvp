'use client';

import { useMemo, useState } from 'react';

const axisQuestions = [
  {
    axis: 'EI',
    title: '에너지 방향',
    options: [
      { trait: 'E', label: '사람과 대화할수록 에너지가 올라간다' },
      { trait: 'I', label: '혼자 정리할 시간이 있어야 회복된다' },
    ],
  },
  {
    axis: 'SN',
    title: '정보 처리',
    options: [
      { trait: 'S', label: '사실과 경험 기반으로 판단한다' },
      { trait: 'N', label: '패턴과 가능성을 먼저 본다' },
    ],
  },
  {
    axis: 'TF',
    title: '의사결정 기준',
    options: [
      { trait: 'T', label: '원리와 효율 중심으로 결정한다' },
      { trait: 'F', label: '사람과 관계 영향을 함께 본다' },
    ],
  },
  {
    axis: 'JP',
    title: '생활 패턴',
    options: [
      { trait: 'J', label: '미리 계획하고 마감하는 편이다' },
      { trait: 'P', label: '상황에 맞춰 유연하게 조정한다' },
    ],
  },
] as const;

type Axis = (typeof axisQuestions)[number]['axis'];

type MbtiMiniQuizProps = {
  onResolved: (payload: {
    mbtiType: string;
    confidence: number;
    answers: Record<string, string>;
  }) => void;
};

export function MbtiMiniQuiz({ onResolved }: MbtiMiniQuizProps) {
  const [answers, setAnswers] = useState<Record<Axis, string>>({
    EI: '',
    SN: '',
    TF: '',
    JP: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completed = useMemo(
    () => axisQuestions.every((question) => Boolean(answers[question.axis])),
    [answers],
  );

  function select(axis: Axis, trait: string) {
    setAnswers((prev) => ({
      ...prev,
      [axis]: trait,
    }));
  }

  async function submitResolve() {
    if (!completed) return;
    setLoading(true);
    setError(null);

    try {
      const payload = axisQuestions.map((question) => ({
        axis: question.axis,
        trait: answers[question.axis],
      }));

      const response = await fetch('/api/mbti/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: payload }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError('MBTI 계산 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      onResolved({
        mbtiType: data.mbtiType,
        confidence: data.confidence,
        answers,
      });
    } catch {
      setError('네트워크 오류로 MBTI 계산에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mbti-mini">
      <p className="label">MBTI 4문항 간이 진단</p>
      <p className="helper">모를 때만 사용하세요. 결과는 해석 톤 개인화를 위한 임시 타입입니다.</p>

      {axisQuestions.map((question) => (
        <div className="mbti-mini__axis" key={question.axis}>
          <p className="helper">{question.title}</p>
          <div className="mbti-mini__options">
            {question.options.map((option) => (
              <button
                key={option.trait}
                type="button"
                className={`mbti-chip ${answers[question.axis] === option.trait ? 'active' : ''}`}
                onClick={() => select(question.axis, option.trait)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      {error ? <p className="error">{error}</p> : null}

      <button type="button" className="btn-secondary" onClick={submitResolve} disabled={!completed || loading}>
        {loading ? 'MBTI 계산 중...' : 'MBTI 타입 반영'}
      </button>
    </div>
  );
}
