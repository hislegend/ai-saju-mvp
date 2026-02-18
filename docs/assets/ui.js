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
