const REVIEWS = [
  { name: '민지', text: '핵심 포인트가 정확해서 놀랐어요. 무료 결과만으로도 방향이 잡혔습니다.' },
  { name: '성호', text: 'MBTI별 행동 가이드가 실전적이라 바로 적용했습니다.' },
  { name: '지현', text: '캐릭터 톤이 좋아서 읽는 몰입감이 높았습니다.' },
];

export function ReviewSection() {
  return (
    <section className="home-reviews" aria-label="리뷰 섹션">
      <h2>실사용자 후기</h2>
      <div className="home-review-stars" aria-label="평점 4.9점">★★★★★ <span>4.9 / 5.0</span></div>
      <div className="home-review-list">
        {REVIEWS.map((review) => (
          <article key={review.name} className="home-review-card">
            <p>{review.text}</p>
            <span>— {review.name}님</span>
          </article>
        ))}
      </div>
    </section>
  );
}
