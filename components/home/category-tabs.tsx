import Link from 'next/link';

const TABS = [
  { label: '1분사주', href: '/quick' },
  { label: '궁합', href: '/fortune/seyeon' },
  { label: '재물운', href: '/fortune/hwaryeon' },
  { label: '연애운', href: '/fortune/seyeon' },
  { label: '신년운세', href: '/fortune/cheongun' },
];

export function CategoryTabs() {
  return (
    <section className="home-tabs" aria-label="카테고리 빠른 선택">
      <div className="home-tabs-scroll">
        {TABS.map((tab) => (
          <Link key={tab.label} href={tab.href} className="home-tab-item">
            {tab.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
