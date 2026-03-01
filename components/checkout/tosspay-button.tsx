'use client';

export function TossPayButton() {
  return (
    <button
      type="button"
      className="btn"
      onClick={() => window.alert('토스페이 연동은 Phase 2 백엔드에서 연결됩니다.')}
    >
      토스페이로 결제하기
    </button>
  );
}
