type ScoreCircleProps = {
  score: number;
};

export function ScoreCircle({ score }: ScoreCircleProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="score-circle-wrap" aria-label={`총운 점수 ${clamped}점`}>
      <svg className="score-circle" viewBox="0 0 140 140" role="img" aria-hidden="true">
        <circle cx="70" cy="70" r={radius} className="score-circle-bg" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          className="score-circle-fg"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
        />
      </svg>
      <div className="score-circle-center">
        <p className="score-circle-label">총운</p>
        <p className="score-circle-value">{clamped}</p>
      </div>
    </div>
  );
}
