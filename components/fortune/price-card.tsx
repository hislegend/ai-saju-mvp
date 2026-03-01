function toKrw(value: number) {
  return new Intl.NumberFormat('ko-KR').format(value);
}

type PriceCardProps = {
  originalPrice?: number;
  salePrice?: number;
};

export function PriceCard({ originalPrice = 19000, salePrice = 9900 }: PriceCardProps) {
  const discountRate = Math.round((1 - salePrice / originalPrice) * 100);

  return (
    <section className="fortune-price-card">
      <p>오늘의 특별가</p>
      <div>
        <span>{toKrw(originalPrice)}원</span>
        <strong>{toKrw(salePrice)}원</strong>
      </div>
      <em>{discountRate}% 할인</em>
    </section>
  );
}
