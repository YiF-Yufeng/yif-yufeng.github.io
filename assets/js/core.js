/* ============================================================
   assets/js/core.js —— 全站公共逻辑（所有页面都加载）
   ------------------------------------------------------------
   ★ 这是"功能代码"文件，日常补充内容不需要改它。

   职责：
     1. 路径处理：根据 <body data-root="../"> 把 "assets/..." 这类根相对路径
        转成当前页面可用的相对路径（首页 data-root=""，pages/ 下为 "../"）。
     2. 注入导航栏与页脚（内容来自 content/site.js 与 content/profile.js），
        并根据 <body data-page="..."> 高亮当前栏目。
     3. 工具函数：HTML 转义、日期格式化、图标、标签渲染。
     4. 读取 assets/data/meta.json（GitHub Actions 生成的文章日期与评论数）。
     5. Markdown 渲染（marked）+ 公式渲染（KaTeX），并修正 Markdown 里的相对路径。
     6. giscus 评论区嵌入 + 监听 giscus 回传的真实评论数。
     7. 横向滑轨的鼠标拖动。

   所有对外接口挂在全局对象 Core 上，供 pages.js 调用。
   ============================================================ */
(function () {
  'use strict';

  var Core = window.Core = {};

  /* ------------------------------------------------------------
     1. 路径
     ------------------------------------------------------------ */
  // 站点根目录相对当前页面的前缀："" 或 "../"
  var ROOT = (document.body.getAttribute('data-root') || '');
  Core.root = ROOT;

  // 把以仓库根为基准的路径（如 "assets/images/photo.jpg"）转成当前页面可用的 URL。
  // 绝对地址（http/https/mailto/#/data:/以 / 开头）原样返回。
  Core.url = function (path) {
    if (!path) return '';
    if (/^(https?:|mailto:|tel:|data:|#|\/)/i.test(path)) return path;
    return ROOT + path;
  };

  // 页面链接：Core.page('thinking') → "pages/thinking.html"（首页）或 "thinking.html"（子页）
  Core.page = function (name, query) {
    var base = ROOT ? '' : 'pages/';
    return base + name + '.html' + (query || '');
  };

  // 读取当前网址中的 ?id=xxx
  Core.queryParam = function (key) {
    var m = new RegExp('[?&]' + key + '=([^&#]*)').exec(window.location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
  };

  /* ------------------------------------------------------------
     3. 工具函数
     ------------------------------------------------------------ */
  // 文本转义（用于把纯文本安全地放进 HTML 属性 / 标签之间）
  Core.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  // 日期格式化：'2026-08-12' 或 ISO 字符串 → 'Aug 12, 2026'；'2026-08' → 'Aug 2026'
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  Core.fmtDate = function (s) {
    if (!s) return '';
    var m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(String(s));
    if (!m) return String(s);
    var mon = MONTHS[parseInt(m[2], 10) - 1] || m[2];
    return m[3] ? mon + ' ' + parseInt(m[3], 10) + ', ' + m[1] : mon + ' ' + m[1];
  };
  // 只取 'YYYY-MM-DD' 部分（用于比较两天是否相同）
  Core.dayOf = function (s) { return s ? String(s).slice(0, 10) : ''; };

  // 评论气泡图标（SVG）
  Core.ICON_COMMENT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';

  // 联系方式按钮图标（profile.js 的 links[].icon 对应这里的键名）
  var ICONS = {
    email: '<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>',
    researchgate: '<path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm3 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm0 5c-1.1 0-2 .9-2 2v2h4v-2c0-1.1-.9-2-2-2zm5.5-5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/>',
    github: '<path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.66.41.35.77 1.05.77 2.12v3.14c0 .31.21.68.8.56A10.5 10.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/>',
    scholar: '<path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3zm-7 9.9V17c0 2.21 3.13 4 7 4s7-1.79 7-4v-4.1l-7 3.82-7-3.82z"/>',
    orcid: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8.5 7.2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm.8 3.3h-1.6v6.8h1.6v-6.8zm2.2 0h3.1c2.6 0 3.9 1.6 3.9 3.4 0 1.9-1.4 3.4-3.9 3.4h-3.1v-6.8zm1.6 1.4v4h1.4c1.8 0 2.4-1 2.4-2s-.7-2-2.4-2h-1.4z"/>',
    twitter: '<path d="M18.2 2h3.3l-7.2 8.3L22.8 22h-6.6l-5.2-6.8L5 22H1.7l7.7-8.8L1.3 2H8l4.7 6.2L18.2 2zm-1.2 18h1.8L7 3.9H5L17 20z"/>',
    link: '<path d="M3.9 12a5 5 0 0 1 5-5h4v2h-4a3 3 0 1 0 0 6h4v2h-4a5 5 0 0 1-5-5zm6.1 1h4v-2h-4v2zm5-6h-4V7h4a5 5 0 0 1 0 10h-4v-2h4a3 3 0 1 0 0-6z"/>'
  };
  Core.icon = function (name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || ICONS.link) + '</svg>';
  };

  // 小标签：Core.tagHtml('Dissertation', 'amber') / 可选 href 变成链接
  Core.tagHtml = function (label, style, href) {
    var cls = 'tag' + (style && style !== 'blue' ? ' tag-' + style : '');
    return href
      ? '<a class="' + cls + '" href="' + Core.esc(href) + '">' + Core.esc(label) + '</a>'
      : '<span class="' + cls + '">' + Core.esc(label) + '</span>';
  };

  // 评论数：meta 中没有数据时显示 "–"（部署后由 Actions 填充）
  Core.commentHtml = function (n, extraClass) {
    var text = (typeof n === 'number') ? String(n) : '–';
    return '<span class="comment-count ' + (extraClass || '') + '" data-comment-count>' +
      Core.ICON_COMMENT + '<span>' + text + '</span></span>';
  };

  // 设置浏览器标签页标题："页面名 · Yufeng Zhou"
  Core.setTitle = function (name) {
    var suffix = (window.SITE && SITE.titleSuffix) || '';
    document.title = name ? name + (suffix ? ' · ' + suffix : '') : suffix;
  };

  /* ------------------------------------------------------------
     2. 导航栏与页脚
     ------------------------------------------------------------ */
  // 各页面属于哪个导航栏目（<body data-page> → SITE.nav[].page）
  var NAV_GROUP = {
    research: 'research', topic: 'research',
    publications: 'publications',
    activity: 'activity', conferences: 'activity',
    thinking: 'thinking', post: 'thinking'
  };

  function renderHeader() {
    var el = document.getElementById('site-header');
    if (!el || !window.SITE) return;
    var page = document.body.getAttribute('data-page') || '';
    var current = NAV_GROUP[page] || '';
    var brand = (window.PROFILE && PROFILE.name) || SITE.titleSuffix || '';

    var links = SITE.nav.map(function (item) {
      var active = item.page === current ? ' active' : '';
      return '<a class="nav-link' + active + '" href="' + Core.page(item.page) + '">' + Core.esc(item.label) + '</a>';
    }).join('');

    el.innerHTML =
      '<header class="nav"><div class="container nav-inner">' +
        '<a class="nav-brand" href="' + (ROOT || './') + 'index.html">' + Core.esc(brand).replace(/ /g, '&nbsp;') + '</a>' +
        '<button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false"><span></span><span></span><span></span></button>' +
        '<nav class="nav-menu" id="nav-menu">' + links + '</nav>' +
      '</div></header>';

    // 移动端汉堡菜单
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('nav-menu');
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  function renderFooter() {
    var el = document.getElementById('site-footer');
    if (!el) return;
    var name = (window.PROFILE && PROFILE.name) || (window.SITE && SITE.titleSuffix) || '';
    var email = (window.PROFILE && PROFILE.email) || '';
    el.innerHTML =
      '<footer class="footer"><div class="container"><p>© ' + new Date().getFullYear() + ' ' + Core.esc(name) +
      (email ? ' · <a href="mailto:' + Core.esc(email) + '">' + Core.esc(email) + '</a>' : '') +
      '</p></div></footer>';
  }

  /* ------------------------------------------------------------
     4. meta.json（文章日期 + 评论数，由 GitHub Actions 生成）
     ------------------------------------------------------------
     文件不存在（本地预览 / 尚未部署）时静默返回空对象，页面照常显示。 */
  var metaPromise = null;
  Core.loadMeta = function () {
    if (metaPromise) return metaPromise;
    metaPromise = fetch(ROOT + 'assets/data/meta.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : {}; })
      .catch(function () { return {}; });
    return metaPromise;
  };

  // 取某篇文章的元信息 {created, updated, comments, replies, url}；没有则返回 {}
  Core.postMeta = function (meta, slug) {
    return (meta && meta.posts && meta.posts[slug]) || {};
  };

  // 文章显示用的发布日期：手动 date 优先，其次 meta 中的 created
  Core.postDate = function (post, pm) {
    return post.date || (pm && pm.created) || '';
  };
  // 评论数 = 评论 + 回复；无数据返回 null
  Core.postComments = function (pm) {
    if (!pm || typeof pm.comments !== 'number') return null;
    return pm.comments + (pm.replies || 0);
  };

  /* ------------------------------------------------------------
     5. Markdown + 公式渲染
     ------------------------------------------------------------
     读取 content/ 下的 .md 文件，用 marked 转成 HTML，放进 el（class="prose"），
     再用 KaTeX 渲染 $...$ / $$...$$，最后把 Markdown 里以仓库根为基准的
     相对路径（图片 / 链接）转成当前页面可用的路径。 */
  Core.renderMarkdown = function (mdPath, el) {
    return fetch(ROOT + mdPath, { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function (md) {
        if (window.marked && typeof marked.parse === 'function') {
          el.innerHTML = marked.parse(md, { mangle: false, headerIds: false });
        } else {
          // CDN 不可用时的兜底：按纯文本显示
          el.innerHTML = '<div class="notice">Markdown renderer failed to load; showing raw text.</div><pre>' + Core.esc(md) + '</pre>';
        }
        fixRelativeUrls(el);
        renderMath(el);
      })
      .catch(function (err) {
        var isFile = window.location.protocol === 'file:';
        el.innerHTML = '<div class="notice">' +
          (isFile
            ? 'This page loads its text from a Markdown file, which browsers block when a site is opened directly from disk (<code>file://</code>). ' +
              'Preview through a local server instead — e.g. run <code>python -m http.server</code> in the site folder and open <code>http://localhost:8000</code>. On GitHub Pages this works automatically.'
            : 'Could not load <code>' + Core.esc(mdPath) + '</code> (' + Core.esc(err.message) + '). Check that the file exists and the name matches.') +
          '</div>';
      });
  };

  function fixRelativeUrls(el) {
    if (!ROOT) return;
    var fix = function (node, attr) {
      var v = node.getAttribute(attr);
      if (v && !/^(https?:|mailto:|tel:|data:|#|\/)/i.test(v)) node.setAttribute(attr, ROOT + v);
    };
    el.querySelectorAll('img[src]').forEach(function (n) { fix(n, 'src'); });
    el.querySelectorAll('a[href]').forEach(function (n) { fix(n, 'href'); });
  }

  function renderMath(el) {
    if (typeof window.renderMathInElement !== 'function') return;
    try {
      renderMathInElement(el, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\[', right: '\\]', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false
      });
    } catch (e) { /* 公式出错不影响正文 */ }
  }

  /* ------------------------------------------------------------
     6. giscus 评论区
     ------------------------------------------------------------
     把 giscus 脚本插入 el。term 为该文章的 Discussion 标题（termPrefix + slug），
     与 scripts/build-meta.js 统计评论数时使用的标题一致。
     giscus 加载后会通过 postMessage 回传真实评论数，这里顺带更新页面上的数字。 */
  Core.mountGiscus = function (el, slug) {
    var g = window.SITE && SITE.giscus;
    if (!g || !g.repoId || /^REPLACE_WITH/.test(g.repoId) || /^REPLACE_WITH/.test(g.categoryId)) {
      el.innerHTML = '<div class="notice">The discussion area is not configured yet. ' +
        'Fill in <code>giscus.repoId</code> and <code>giscus.categoryId</code> in <code>content/site.js</code> (see README).</div>';
      return;
    }
    var s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    var attrs = {
      'data-repo': SITE.repo,
      'data-repo-id': g.repoId,
      'data-category': g.category,
      'data-category-id': g.categoryId,
      'data-mapping': 'specific',
      'data-term': (g.termPrefix || '') + slug,
      'data-strict': '1',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '1',
      'data-input-position': 'top',
      'data-theme': 'light',
      'data-lang': 'en',
      'data-loading': 'lazy',
      'crossorigin': 'anonymous'
    };
    Object.keys(attrs).forEach(function (k) { s.setAttribute(k, attrs[k]); });
    s.async = true;
    el.appendChild(s);

    // giscus 回传的讨论元数据 → 实时更新页面上的评论数
    window.addEventListener('message', function (e) {
      if (e.origin !== 'https://giscus.app') return;
      var d = e.data && e.data.giscus && e.data.giscus.discussion;
      if (!d) return;
      var n = (d.totalCommentCount || 0) + (d.totalReplyCount || 0);
      document.querySelectorAll('[data-comment-count] span').forEach(function (span) { span.textContent = n; });
    });
  };

  /* ------------------------------------------------------------
     7. 横向滑轨：鼠标按住拖动（拖动后松手不误触卡片链接）
     ------------------------------------------------------------ */
  Core.enableDragScroll = function (el) {
    var down = false, startX = 0, startLeft = 0, moved = false;
    el.addEventListener('mousedown', function (e) {
      down = true; moved = false;
      startX = e.pageX; startLeft = el.scrollLeft;
      el.classList.add('dragging');
    });
    window.addEventListener('mousemove', function (e) {
      if (!down) return;
      var dx = e.pageX - startX;
      if (Math.abs(dx) > 4) moved = true;
      if (moved) { e.preventDefault(); el.scrollLeft = startLeft - dx; }
    });
    window.addEventListener('mouseup', function () { down = false; el.classList.remove('dragging'); });
    el.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);
  };

  /* ------------------------------------------------------------
     启动：注入导航与页脚（页面内容由 pages.js 渲染）
     ------------------------------------------------------------ */
  renderHeader();
  renderFooter();
})();
