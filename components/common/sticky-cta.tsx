import Link from 'next/link';

type StickyCtaProps = {
  href: string;
  label: string;
};

export function StickyCta({ href, label }: StickyCtaProps) {
  return (
    <div className="sticky-cta" aria-label="고정 행동 버튼">
      <div className="sticky-cta__inner">
        <Link className="btn" href={href}>
          {label}
        </Link>
      </div>
    </div>
  );
}
