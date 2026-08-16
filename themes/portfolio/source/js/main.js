(function () {
  'use strict';

  // 1) 滚动出现动画
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(els, function (el) { el.classList.add('in'); });
  }

  // 2) 终端逐行淡入（纯装饰，禁用 JS 时仍完整可见）
  var term = document.querySelector('.terminal-body');
  if (term) {
    var lines = Array.prototype.slice.call(term.querySelectorAll('.tline'));
    var delay = 350;
    lines.forEach(function (line, i) {
      line.style.opacity = '0';
      line.style.transition = 'opacity .35s ease';
      setTimeout(function () { line.style.opacity = '1'; }, delay * (i + 1));
    });
  }

  // 3) 导航当前区块高亮
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navLinks.forEach(function (a) {
            a.style.color = a.getAttribute('href') === '#' + e.target.id ? '' : '';
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }
})();
