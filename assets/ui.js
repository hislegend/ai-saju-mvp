(function () {
  var path = window.location.pathname;
  var navLinks = document.querySelectorAll('.site-nav a[data-page]');
  navLinks.forEach(function (link) {
    if (path.endsWith(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });

  var messages = [
    '방금 전 서울 사용자: 2026 신년운세 결제 완료',
    '3분 전 부산 사용자: 무료 1분 사주 결과 공유',
    '5분 전 인천 사용자: MBTI 맞춤 리포트 열람',
    '8분 전 대전 사용자: 리딤코드 사용 후 결과 확인'
  ];

  var target = document.getElementById('social-proof-text');
  if (target) {
    var idx = 0;
    target.textContent = messages[idx];
    window.setInterval(function () {
      idx = (idx + 1) % messages.length;
      target.textContent = messages[idx];
    }, 3200);
  }

  var stepRoot = document.querySelector('[data-step-root]');
  if (stepRoot) {
    var currentStep = 1;
    var panel1 = stepRoot.querySelector('[data-step-panel="1"]');
    var panel2 = stepRoot.querySelector('[data-step-panel="2"]');
    var countEl = stepRoot.querySelector('[data-step-count]');
    var labelEl = stepRoot.querySelector('[data-step-label]');
    var barEl = stepRoot.querySelector('[data-step-bar]');

    function renderStep() {
      if (!panel1 || !panel2 || !countEl || !labelEl || !barEl) return;
      if (currentStep === 1) {
        panel1.classList.remove('is-hidden');
        panel2.classList.add('is-hidden');
        countEl.textContent = '1/2 단계';
        labelEl.textContent = '기본 정보 입력';
        barEl.style.width = '50%';
      } else {
        panel1.classList.add('is-hidden');
        panel2.classList.remove('is-hidden');
        countEl.textContent = '2/2 단계';
        labelEl.textContent = '성향/옵션 선택';
        barEl.style.width = '100%';
      }
    }

    var nextBtn = stepRoot.querySelector('[data-step-next]');
    var backBtn = stepRoot.querySelector('[data-step-back]');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        currentStep = 2;
        renderStep();
      });
    }
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        currentStep = 1;
        renderStep();
      });
    }
    renderStep();
  }

  var pageParams = new URLSearchParams(window.location.search);
  var profileName = (pageParams.get('name') || '').trim();
  var profileMbti = (pageParams.get('mbti') || '').trim().toUpperCase();

  function withProfileQuery(url) {
    if (!url || (!profileName && !profileMbti)) return url;
    if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0 || url.indexOf('#') === 0) return url;

    var parsed = new URL(url, window.location.href);
    if (profileName && !parsed.searchParams.get('name')) parsed.searchParams.set('name', profileName);
    if (profileMbti && !parsed.searchParams.get('mbti')) parsed.searchParams.set('mbti', profileMbti);
    return parsed.pathname + parsed.search + parsed.hash;
  }

  var links = document.querySelectorAll('a[href]');
  links.forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href.indexOf('.html') === -1) return;
    var next = withProfileQuery(href);
    if (next) link.setAttribute('href', next);
  });

  var fakeButtons = document.querySelectorAll('[data-fake-next]');
  fakeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var to = button.getAttribute('data-fake-next');
      if (to) {
        window.location.href = withProfileQuery(to);
      }
    });
  });

  var accordion = document.querySelector('[data-accordion]');
  if (accordion) {
    var accItems = accordion.querySelectorAll('[data-acc-item]');
    accItems.forEach(function (item) {
      var trigger = item.querySelector('[data-acc-trigger]');
      var panel = item.querySelector('[data-acc-panel]');
      if (!trigger || !panel) return;

      trigger.addEventListener('click', function () {
        var expanded = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        panel.classList.toggle('is-hidden', expanded);
        var mark = trigger.querySelector('span:last-child');
        if (mark) {
          mark.textContent = expanded ? '+' : '−';
        }
      });
    });
  }

  var generateBtn = document.querySelector('[data-generate-result]');
  if (generateBtn) {
    generateBtn.addEventListener('click', function () {
      var nameInput = document.querySelector('[data-input-name]');
      var mbtiInput = document.querySelector('[data-input-mbti]');
      var name = nameInput && nameInput.value ? nameInput.value.trim() : '홍길동';
      var mbti = mbtiInput && mbtiInput.value ? mbtiInput.value.trim().toUpperCase() : 'ENFP';
      var url = './result.html?name=' + encodeURIComponent(name) + '&mbti=' + encodeURIComponent(mbti);
      window.location.href = url;
    });
  }

  var mbtiRoot = document.querySelector('[data-mbti-root]');
  if (mbtiRoot) {
    var mbtiData = {
      ENFP: {
        core: '기회가 왔을 때 빠르게 사람을 모아 실행하면 성과가 커집니다.',
        risk: '결정이 늦어지면 집중력이 흩어지고 체력 소모가 커집니다.',
        action: '하루 1개 핵심 과제만 완료하는 방식으로 속도를 유지하세요.'
      },
      ENTJ: {
        core: '이번 주는 강한 결단이 운을 끌어올립니다. 주도권을 먼저 잡는 편이 유리합니다.',
        risk: '완벽주의로 일정이 밀리면 오히려 기회를 놓칩니다.',
        action: '회의 전에 결론 1문장 + 근거 3개를 먼저 정리해 전달하세요.'
      },
      INFJ: {
        core: '관계 흐름이 실질 성과를 좌우합니다. 신뢰를 쌓는 대화가 금전운까지 연결됩니다.',
        risk: '감정 피로를 방치하면 판단이 느려집니다.',
        action: '하루 20분 회복 루틴(산책/정리)을 고정해 에너지를 지키세요.'
      },
      ISTJ: {
        core: '안정적인 루틴이 운을 키우는 시기입니다. 작은 개선이 누적 이익으로 이어집니다.',
        risk: '변화 회피로 인해 성장 타이밍을 놓칠 수 있습니다.',
        action: '이번 주 1회는 익숙하지 않은 제안도 테스트해 데이터로 판단하세요.'
      }
    };

    function mbtiCluster(type) {
      var t = (type || '').toUpperCase();
      if (mbtiData[t]) return t;
      if (t.includes('N') && t.includes('T')) return 'ENTJ';
      if (t.includes('N') && t.includes('F')) return 'INFJ';
      if (t.includes('S') && t.includes('J')) return 'ISTJ';
      return 'ENFP';
    }

    var params = new URLSearchParams(window.location.search);
    var mbti = mbtiCluster(params.get('mbti') || 'ENFP');
    var name = (params.get('name') || '홍길동').trim();

    var item = mbtiData[mbti];
    var coreEl = mbtiRoot.querySelector('[data-mbti-core]');
    var riskEl = mbtiRoot.querySelector('[data-mbti-risk]');
    var actionEl = mbtiRoot.querySelector('[data-mbti-action]');
    var mbtiTextEls = document.querySelectorAll('[data-user-mbti]');
    var nameTextEls = document.querySelectorAll('[data-user-name]');

    if (item && coreEl && riskEl && actionEl) {
      coreEl.textContent = item.core;
      riskEl.textContent = item.risk;
      actionEl.textContent = item.action;
    }

    mbtiTextEls.forEach(function (el) {
      el.textContent = mbti;
    });
    nameTextEls.forEach(function (el) {
      el.textContent = name || '홍길동';
    });
  }

  var copyBtn = document.querySelector('[data-copy-result-link]');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var link = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link).then(function () {
          copyBtn.textContent = '링크 복사 완료';
        });
      }
    });
  }
})();
