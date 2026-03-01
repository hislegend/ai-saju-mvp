import type { ReactNode } from 'react';

type BlurSectionProps = {
  title: string;
  children: ReactNode;
  ctaLabel?: string;
};

export function BlurSection({ title, children, ctaLabel = '프리미엄으로 전체 보기' }: BlurSectionProps) {
  return (
    <section className="blur-block" aria-label={`${title} 잠금됨`}>
      <div className="blur-block-content">{children}</div>
      <div className="blur-block-overlay">
        <p>{title}</p>
        <span>{ctaLabel}</span>
      </div>
    </section>
  );
}
