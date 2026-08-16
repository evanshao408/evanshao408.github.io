(function () {
  'use strict';
  // 内容默认全部可见，此脚本仅做无依赖的增强。

  // 终端逐行淡入（若脚本未运行，内容依然完整显示）
  var term = document.querySelector('.hero-terminal');
  if (term && 'IntersectionObserver' in window) {
    var lines = term.querySelectorAll('.term-line');
    lines.forEach(function (line) { line.style.opacity = '0'; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        lines.forEach(function (line, i) {
          setTimeout(function () {
            line.style.transition = 'opacity .4s ease';
            line.style.opacity = '1';
          }, 260 * i);
        });
        io.disconnect();
      });
    }, { threshold: 0.4 });
    io.observe(term);
  }

  // 导航当前区块高亮
  var links = document.querySelectorAll('.nav-links a');
  var sections = document.querySelectorAll('section[id]');
  if (links.length && sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          a.style.color = a.getAttribute('href') === '#' + e.target.id ? '' : '';
          a.style.opacity = a.getAttribute('href') === '#' + e.target.id ? '1' : '.55';
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }
})();
