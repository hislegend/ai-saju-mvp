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

  var fakeButtons = document.querySelectorAll('[data-fake-next]');
  fakeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var to = button.getAttribute('data-fake-next');
      if (to) {
        window.location.href = to;
      }
    });
  });
})();
