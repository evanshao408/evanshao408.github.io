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

  // ============ 知识中台展示区：五档路由交互 ============
  var ROUTES = {
    KG_ONLY:  { name: 'KG_ONLY · 仅图谱', desc: '查询为明确实体关系时，仅查知识图谱（Cypher），不触达文档。最快、最确定，适合结构化事实型问题——例如某车型的供应商或某零部件的故障关联。', sides: { kg: true, rag: false } },
    KG_FIRST: { name: 'KG_FIRST · 图谱优先', desc: '先查图谱取实体与关系，证据不足时回退文档 RAG 补充。适合以关系为主、需要文档佐证边界的复杂型问题。', sides: { kg: true, rag: true } },
    HYBRID:   { name: 'HYBRID · 混合检索', desc: '图谱与文档并行检索，证据融合后统一门控与生成。适合综合复杂型问题——既要实体关系，又需长文档佐证。', sides: { kg: true, rag: true } },
    RAG_FIRST:{ name: 'RAG_FIRST · 文档优先', desc: '先做文档 RAG 召回，若命中受控术语或图谱实体再做关系补检。适合以长文档语义为主、需图谱精确定位的深度文献型问题。', sides: { kg: true, rag: true } },
    RAG_ONLY: { name: 'RAG_ONLY · 仅文档', desc: '查询为长文档语义、无明确图谱实体时，仅查文档 RAG，不触达图谱。适合深度文献型与说明类问题。', sides: { kg: false, rag: true } }
  };

  var showcase = document.getElementById('kp-showcase');
  if (showcase) {
    var tabs = showcase.querySelectorAll('.sc-route-tab');
    var panelName = showcase.querySelector('.sc-route-name');
    var panelDesc = showcase.querySelector('.sc-route-desc');
    var pathSteps = showcase.querySelectorAll('.sc-route-step');
    var archKG = showcase.querySelector('.sc-source-node[data-side="kg"]');
    var archRAG = showcase.querySelector('.sc-source-node[data-side="rag"]');

    function applyRoute(key) {
      var r = ROUTES[key];
      if (!r) return;
      tabs.forEach(function (t) { t.classList.toggle('active', t.dataset.route === key); });
      panelName.textContent = r.name;
      panelDesc.textContent = r.desc;
      pathSteps.forEach(function (s) {
        var side = s.dataset.side;
        var used = (side === 'gate') || (side === 'gen') || (r.sides[side] === true);
        s.classList.toggle('active', used);
        s.classList.toggle('dim', !used);
      });
      if (archKG) { archKG.classList.toggle('hl', r.sides.kg); archKG.classList.toggle('dim', !r.sides.kg); }
      if (archRAG) { archRAG.classList.toggle('hl', r.sides.rag); archRAG.classList.toggle('dim', !r.sides.rag); }
    }
    tabs.forEach(function (t) {
      t.addEventListener('click', function () { applyRoute(t.dataset.route); });
    });
    applyRoute('HYBRID');

    // GitHub star/fork 实时数据（失败静默回落到 HTML 静态值）
    var starEl = showcase.querySelector('[data-stars]');
    var forkEl = showcase.querySelector('[data-forks]');
    if (starEl && forkEl && window.fetch) {
      fetch('https://api.github.com/repos/evanshao408/Automotive-Test-New-Energy-Knowledge-Platform')
        .then(function (res) { return res.ok ? res.json() : Promise.reject(); })
        .then(function (d) {
          if (typeof d.stargazers_count === 'number') starEl.textContent = d.stargazers_count;
          if (typeof d.forks_count === 'number') forkEl.textContent = d.forks_count;
        })
        .catch(function () { /* 保留静态值 */ });
    }
  }
})();
