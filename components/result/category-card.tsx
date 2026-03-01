type CategoryCardProps = {
  title: string;
  icon: string;
  score: number;
  summaryLines: string[];
  detailText?: string | null;
};

export function CategoryCard({ title, icon, score, summaryLines, detailText }: CategoryCardProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));

  return (
    <article className="fortune-card">
      <div className="fortune-card-head">
        <p className="fortune-card-title">
          <span aria-hidden="true">{icon}</span> {title}
        </p>
        <span className="fortune-card-score">{clamped}점</span>
      </div>
      <progress className="fortune-progress" value={clamped} max={100} aria-label={`${title} 점수`} />
      <ul className="fortune-lines">
        {summaryLines.map((line, index) => (
          <li key={`${title}-${index}`}>{line}</li>
        ))}
      </ul>

      {detailText ? <p className="fortune-detail">{detailText}</p> : null}
    </article>
  );
}
