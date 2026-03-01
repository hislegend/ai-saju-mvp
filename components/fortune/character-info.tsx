type CharacterInfoProps = {
  description: string;
  points: string[];
};

export function CharacterInfo({ description, points }: CharacterInfoProps) {
  return (
    <section className="fortune-info-card">
      <h2>상담 스타일</h2>
      <p>{description}</p>

      <h3>이 사주방에서 알 수 있는 것</h3>
      <ul>
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  );
}
