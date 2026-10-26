/* ============================================================
   Thinking 话题数据 —— 单一数据源
   首页的横向卡片 和 Thinking 页的论坛列表 都从这里渲染，
   保证两处的标题 / 简介 / 标签 / 日期 / 留言数始终一致。

   新增话题：往 THINKING 数组【最前面】插入一项即可（最新的在最左/最上），
   并新建对应的 pages/thinking-<slug>.html 页。
   comments：手动维护，与 giscus 里的实际讨论数保持同步（未接 giscus 前为 0）。
   ============================================================ */
(function () {
  var THINKING = [
    { slug: 'tc-frequency',     title: 'TC frequency 的讨论',          desc: '全球台风年频数为何稳定在 ~90 个？时空填充与承载力视角。', tag: '台风频数', date: '2026-08-12', comments: 0 },
    { slug: 'hoi',              title: '关于 HOI 对流组织程度的讨论',     desc: '用信息熵量化对流组织：HOI 的构建与解读。',            tag: '对流组织', date: '2026-07-28', comments: 0 },
    { slug: 'threshold',        title: '关于识别对流系统阈值选择的讨论',   desc: '亮温阈值如何影响对流组织度量，如何选择鲁棒阈值。',       tag: '对流组织', date: '2026-07-05', comments: 0 },
    { slug: 'packing-capacity', title: '时空填充与台风的“承载力”',        desc: '从“装箱问题”看热带大气的有限承载力。',                tag: '台风频数', date: '2026-06-18', comments: 0 },
    { slug: 'intensification',  title: '台风增强速率与持续时间的分解',     desc: '把强度拆成增强速率与持续时间，看各自的气候响应。',        tag: '台风特征', date: '2026-05-30', comments: 0 },
    { slug: 'cold-wake',        title: '海洋冷尾迹与台风—海洋耦合',       desc: '冷尾迹减弱如何影响台风增强与海气耦合。',                tag: '台风特征', date: '2026-05-09', comments: 0 }
  ];

  var COMMENT_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';

  function url(base, slug) {
    return base + 'thinking-' + slug + '.html';
  }

  // 首页：横向滑动卡片
  window.renderThinkingCards = function (el, base) {
    el.innerHTML = THINKING.map(function (t) {
      return '<a class="slide-card" href="' + url(base, t.slug) + '">' +
        '<div class="slide-card-top">' +
          '<span class="slide-tag">' + t.tag + '</span>' +
          '<span class="slide-date">' + t.date + '</span>' +
        '</div>' +
        '<h3>' + t.title + '</h3>' +
        '<p class="slide-desc">' + t.desc + '</p>' +
        '<div class="slide-foot">' +
          '<span class="slide-comments">' + COMMENT_ICON + t.comments + ' 讨论</span>' +
          '<span class="slide-more">阅读 →</span>' +
        '</div>' +
      '</a>';
    }).join('');
  };

  // Thinking 页：论坛式列表
  window.renderThinkingThreads = function (el, base) {
    el.innerHTML = THINKING.map(function (t) {
      return '<a class="thread" href="' + url(base, t.slug) + '">' +
        '<div class="thread-main">' +
          '<h3 class="thread-title">' + t.title + '</h3>' +
          '<p class="thread-desc">' + t.desc + '</p>' +
        '</div>' +
        '<div class="thread-meta">' +
          '<span class="thread-comments">' + COMMENT_ICON + t.comments + '</span>' +
          '<span class="thread-date">' + t.date + '</span>' +
        '</div>' +
      '</a>';
    }).join('');
  };
})();
