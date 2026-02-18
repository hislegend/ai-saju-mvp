'use client';

import { FormEvent, useEffect, useState } from 'react';

type MeResponse = {
  user: {
    id: string;
    name: string | null;
    phone: string | null;
    marketingOptIn: boolean;
  } | null;
};

export function LoginForm() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [user, setUser] = useState<MeResponse['user']>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadMe() {
    const response = await fetch('/api/auth/me');
    const data = (await response.json()) as MeResponse;
    setUser(data.user);
  }

  useEffect(() => {
    void loadMe();
  }, []);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          password,
          name: name || undefined,
          marketingOptIn,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || '로그인에 실패했습니다.');
        return;
      }

      await loadMe();
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function loginKakaoMock() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/kakao-mock', {
        method: 'POST',
      });

      if (!response.ok) {
        setError('카카오 모의 로그인이 실패했습니다.');
        return;
      }

      await loadMe();
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        setError('로그아웃 처리에 실패했습니다.');
        return;
      }

      setUser(null);
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card card-pad">
      <p className="eyebrow">Auth</p>
      <h1 className="section-title" style={{ marginBottom: '0.55rem' }}>
        로그인 / 회원 생성
      </h1>
      <p className="section-copy" style={{ marginBottom: '1rem' }}>
        MVP 단계에서는 휴대폰 + 비밀번호 로그인과 카카오 모의 로그인만 제공합니다.
      </p>

      {user ? (
        <div className="grid" style={{ gap: '0.75rem' }}>
          <p>
            현재 로그인: <strong>{user.name || '사용자'}</strong> ({user.phone || '전화번호 없음'})
          </p>
          <button className="btn-danger" type="button" onClick={logout} disabled={loading}>
            로그아웃
          </button>
        </div>
      ) : (
        <form className="reading-form" onSubmit={submitLogin}>
          <div className="form-grid">
            <div className="form-group">
              <label className="label" htmlFor="phone">
                휴대폰 번호
              </label>
              <input
                id="phone"
                className="input"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value.replace(/[^0-9]/g, ''))}
                placeholder="01012341234"
                required
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="password">
                비밀번호
              </label>
              <input
                id="password"
                className="input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={4}
                required
              />
            </div>

            <div className="form-group span-2">
              <label className="label" htmlFor="name">
                이름 (신규 가입 시만 반영)
              </label>
              <input
                id="name"
                className="input"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="홍길동"
              />
            </div>
          </div>

          <label className="check-row">
            <input
              type="checkbox"
              checked={marketingOptIn}
              onChange={(event) => setMarketingOptIn(event.target.checked)}
            />
            마케팅 수신 동의 (신규 가입 시 적용)
          </label>

          {error ? <p className="error">{error}</p> : null}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? '처리 중...' : '휴대폰 로그인'}
          </button>

          <button className="btn-secondary" type="button" onClick={loginKakaoMock} disabled={loading}>
            카카오 모의 로그인
          </button>
        </form>
      )}
    </div>
  );
}
