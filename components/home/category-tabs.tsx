const TABS = ['1분사주', '궁합', '재물운', '연애운', '신년운세'];

export function CategoryTabs() {
  return (
    <section className="home-tabs" aria-label="카테고리 빠른 선택">
      <div className="home-tabs-scroll">
        {TABS.map((tab) => (
          <button key={tab} type="button" className="home-tab-item">
            {tab}
          </button>
        ))}
      </div>
    </section>
  );
}
