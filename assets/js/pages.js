/* ============================================================
   assets/js/pages.js —— 各页面的内容渲染
   ------------------------------------------------------------
   ★ 这是"功能代码"文件，日常补充内容不需要改它。

   每个 HTML 页面只是一个"壳"，<body data-page="xxx"> 标明页面类型，
   本文件根据页面类型，把 content/*.js 里的数据渲染进页面上预留的容器：

     data-page        数据来源                      页面文件
     ---------------  ---------------------------  -------------------------
     home             PROFILE, THINKING            index.html
     research         RESEARCH                     pages/research.html
     topic            RESEARCH, PUBLICATIONS       pages/topic.html?id=<id>
     publications     PUBLICATIONS, PROFILE        pages/publications.html
     activity         ACTIVITY                     pages/activity.html
     conferences      ACTIVITY                     pages/conferences.html
     thinking         THINKING                     pages/thinking.html
     post             THINKING                     pages/post.html?id=<slug>

   依赖 core.js（全局对象 Core）。
   ============================================================ */
(function () {
  'use strict';

  var esc = Core.esc, url = Core.url, page = Core.page;
  var $ = function (id) { return document.getElementById(id); };

  /* ============================================================
     共用片段
     ============================================================ */

  // 标签 id → 定义对象（label / desc）
  function tagDef(id) {
    var list = (window.THINKING && THINKING.tags) || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return { id: id, label: id };
  }

  // 一篇文章的标签 HTML（可点击 → Thinking 页按该标签筛选）
  function postTagsHtml(post) {
    return (post.tags || []).map(function (id) {
      return Core.tagHtml(tagDef(id).label, 'blue', page('thinking', '#tag=' + encodeURIComponent(id)));
    }).join('');
  }

  // 首页 / 其他位置使用的文章滑动卡片
  function postCardHtml(post, meta) {
    var pm = Core.postMeta(meta, post.slug);
    var date = Core.fmtDate(Core.postDate(post, pm));
    return '<a class="slide-card" href="' + page('post', '?id=' + encodeURIComponent(post.slug)) + '">' +
      '<div class="slide-card-top">' +
        '<span class="tags">' + (post.tags || []).slice(0, 2).map(function (id) { return Core.tagHtml(tagDef(id).label); }).join('') + '</span>' +
        '<span class="slide-date">' + esc(date) + '</span>' +
      '</div>' +
      '<h3>' + esc(post.title) + '</h3>' +
      '<p class="slide-desc">' + esc(post.summary) + '</p>' +
      '<div class="slide-foot">' +
        Core.commentHtml(Core.postComments(pm)) +
        '<span class="slide-more">Read →</span>' +
      '</div>' +
    '</a>';
  }

  // 论文条目（Publications 页与主题页共用）
  function pubHtml(p) {
    var statusMap = {
      'published': ['Published', 'green'],
      'submitted': ['Submitted', 'amber'],
      'in-prep':   ['In preparation', 'slate']
    };
    var st = statusMap[p.status] || statusMap['published'];
    var authors = boldOwnName(esc(p.authors));
    var venueParts = [];
    if (p.venue) venueParts.push('<em>' + esc(p.venue) + '</em>');
    if (p.volume) venueParts.push(esc(p.volume));
    var venue = venueParts.join(', ');
    if (p.status === 'submitted' && p.venue) venue = 'Submitted to ' + venue;
    if (p.status === 'in-prep') venue = venue ? venue + ' · in preparation' : 'In preparation';
    venue += (p.year ? ' (' + esc(p.year) + ')' : '');

    var title = p.doi
      ? '<a class="pub-title" href="https://doi.org/' + esc(p.doi) + '" target="_blank" rel="noopener">' + esc(p.title) + '</a>'
      : '<span class="pub-title">' + esc(p.title) + '</span>';

    return '<li class="pub"><div class="pub-main">' + title +
      '<p class="pub-authors">' + authors + '</p>' +
      '<p class="pub-venue">' + venue + '</p>' +
      (p.summary ? '<p class="pub-summary">' + esc(p.summary) + '</p>' : '') +
      '</div><span class="pub-status">' + Core.tagHtml(st[0], st[1]) + '</span></li>';
  }

  // 把作者字符串中本人的署名加粗（依据 PROFILE.authorNames）
  function boldOwnName(s) {
    var names = (window.PROFILE && PROFILE.authorNames) || [];
    names.forEach(function (n) {
      var e = esc(n).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      s = s.replace(new RegExp(e, 'g'), '<strong>' + esc(n) + '</strong>');
    });
    return s;
  }

  // 让页面上所有 .hscroll 支持鼠标拖动
  function enableHscroll() {
    document.querySelectorAll('.hscroll').forEach(Core.enableDragScroll);
  }

  /* ============================================================
     首页
     ============================================================ */
  function renderHome() {
    var P = window.PROFILE;
    Core.setTitle(P.name + ' | ' + P.role);

    // HERO
    $('hero').innerHTML =
      '<div class="hero-photo"><img src="' + url(P.photo) + '" alt="Portrait of ' + esc(P.name) + '"></div>' +
      '<div class="hero-text">' +
        '<h1>' + esc(P.name) + (P.nameZh ? ' <span class="hero-zh">' + esc(P.nameZh) + '</span>' : '') + '</h1>' +
        '<p class="hero-role">' + esc(P.role) + '</p>' +
        '<p class="hero-affil">' + esc(P.affiliation) + '</p>' +
        '<p class="hero-tagline">' + esc(P.tagline) + '</p>' +
        '<div class="hero-links">' + (P.links || []).map(function (l) {
          var ext = /^https?:/i.test(l.url) ? ' target="_blank" rel="noopener"' : '';
          return '<a class="hero-link" href="' + esc(l.url) + '"' + ext + ' title="' + esc(l.label) + '">' + Core.icon(l.icon) + '<span>' + esc(l.label) + '</span></a>';
        }).join('') + '</div>' +
      '</div>';

    // About：简介（第一段用大字）
    $('bio').innerHTML = (P.bio || []).map(function (para, i) {
      return '<p' + (i === 0 ? ' class="lead"' : '') + '>' + para + '</p>';
    }).join('');

    // About：教育经历
    $('education').innerHTML = (P.education || []).map(function (e) {
      return '<div class="edu-item">' +
        '<div class="edu-date">' + esc(e.period) + (e.note ? '<br><span class="muted">' + esc(e.note) + '</span>' : '') + '</div>' +
        '<div class="edu-body"><strong>' + esc(e.degree) + '</strong><p>' + esc(e.detail) + '</p></div>' +
      '</div>';
    }).join('');

    // Thinking：最新 N 篇
    var n = (window.SITE && SITE.homeThinkingCount) || 6;
    var posts = (window.THINKING && THINKING.posts || []).slice(0, n);
    var container = $('thinking-cards');
    var draw = function (meta) {
      container.innerHTML = posts.length
        ? posts.map(function (p) { return postCardHtml(p, meta); }).join('')
        : '<div class="placeholder">No posts yet.</div>';
    };
    draw({});                       // 先无日期 / 评论数渲染，避免等待
    Core.loadMeta().then(draw);     // meta.json 到达后补上日期与评论数
    enableHscroll();
  }

  /* ============================================================
     Research 总览
     ============================================================ */
  function renderResearch() {
    Core.setTitle('Research');
    $('page-desc').textContent = RESEARCH.intro || '';
    $('research-list').innerHTML = RESEARCH.topics.map(function (t) {
      return '<a class="research-card" href="' + page('topic', '?id=' + encodeURIComponent(t.id)) + '">' +
        '<div class="research-card-img">' + (t.image ? '<img src="' + url(t.image) + '" alt="">' : '') + '</div>' +
        '<div class="research-card-body">' +
          (t.tag ? Core.tagHtml(t.tag, t.tagStyle) : '') +
          '<h3>' + esc(t.title) + '</h3>' +
          '<p>' + esc(t.summary) + '</p>' +
          '<span class="research-more">Read more →</span>' +
        '</div>' +
      '</a>';
    }).join('');
  }

  /* ============================================================
     Research 主题详情（topic.html?id=xxx）
     ============================================================ */
  function renderTopic() {
    var id = Core.queryParam('id');
    var t = RESEARCH.topics.filter(function (x) { return x.id === id; })[0];
    if (!t) {
      Core.setTitle('Topic not found');
      $('page-title').textContent = 'Topic not found';
      $('prose').innerHTML = '<div class="notice">No research topic with id <code>' + esc(id) + '</code>. <a href="' + page('research') + '">Back to Research</a>.</div>';
      return;
    }
    Core.setTitle(t.title);
    $('page-tags').innerHTML = t.tag ? Core.tagHtml(t.tag, t.tagStyle) : '';
    $('page-title').textContent = t.title;
    $('page-desc').textContent = t.summary || '';
    Core.renderMarkdown('content/research/' + t.id + '.md', $('prose'));

    // 相关论文：按 DOI 从 PUBLICATIONS 中查找
    var dois = t.publications || [];
    var pubs = (window.PUBLICATIONS && PUBLICATIONS.items || []).filter(function (p) { return dois.indexOf(p.doi) >= 0; });
    if (pubs.length) {
      $('related').innerHTML = '<h2 class="sub-title">Related publications</h2><ol class="pub-list">' + pubs.map(pubHtml).join('') + '</ol>';
      $('related').hidden = false;
    }
  }

  /* ============================================================
     Publications
     ============================================================ */
  function renderPublications() {
    Core.setTitle('Publications');
    $('page-desc').textContent = PUBLICATIONS.intro || '';
    var items = PUBLICATIONS.items.filter(function (p) {
      return PUBLICATIONS.showUnpublished || p.status === 'published' || !p.status;
    });
    // 年份倒序；同年保持文件中的先后顺序
    var byYear = function (a, b) { return (b.year || 0) - (a.year || 0); };
    var first = items.filter(function (p) { return p.firstAuthor; }).sort(byYear);
    var co = items.filter(function (p) { return !p.firstAuthor; }).sort(byYear);

    var html = '';
    if (first.length) html += '<h2 class="sub-title">First-Author Publications</h2><ol class="pub-list">' + first.map(pubHtml).join('') + '</ol>';
    if (co.length) html += '<h2 class="sub-title">Co-Authored Publications</h2><ol class="pub-list">' + co.map(pubHtml).join('') + '</ol>';
    $('pub-sections').innerHTML = html || '<div class="placeholder">No publications listed yet.</div>';
  }

  /* ============================================================
     Activity（会议滑轨 / 学术服务 / 荣誉）
     ============================================================ */
  function confTagsHtml(c) {
    var html = c.type ? Core.tagHtml(c.type) : '';
    if (c.award) html += Core.tagHtml(c.award, 'green');
    return html;
  }

  function renderActivity() {
    Core.setTitle('Activity');
    $('page-desc').textContent = ACTIVITY.intro || '';

    $('conf-cards').innerHTML = (ACTIVITY.conferences || []).map(function (c) {
      return '<a class="slide-card" href="' + page('conferences', '#conf-' + encodeURIComponent(c.id)) + '">' +
        '<div class="slide-card-top"><span class="tags">' + confTagsHtml(c) + '</span>' +
          '<span class="slide-date">' + esc(Core.fmtDate(c.date)) + '</span></div>' +
        '<h3>' + esc(c.title) + '</h3>' +
        '<p class="slide-desc">' + esc(c.venue) + '</p>' +
        '<div class="slide-foot"><span></span><span class="slide-more">Details →</span></div>' +
      '</a>';
    }).join('') || '<div class="placeholder">No conferences listed yet.</div>';

    $('service-list').innerHTML = (ACTIVITY.service || []).map(function (s) {
      return '<li><strong>' + esc(s.label) + ':</strong> ' + s.text + '</li>';
    }).join('');

    $('honor-list').innerHTML = (ACTIVITY.honors || []).map(function (h) {
      return '<li><span class="award-name">' + h.name + '</span><span class="award-meta">' + h.meta + '</span></li>';
    }).join('');

    enableHscroll();
  }

  /* ============================================================
     Conferences 完整列表
     ============================================================ */
  function renderConferences() {
    Core.setTitle('Conferences & Talks');
    $('conf-list').innerHTML = (ACTIVITY.conferences || []).map(function (c) {
      var kind = [c.type, Core.fmtDate(c.date)].filter(Boolean).join(' · ');
      return '<article class="conf" id="conf-' + esc(c.id) + '">' +
        '<div class="conf-head"><h3>' + esc(c.title) + '</h3><span class="tags">' + confTagsHtml(c) + '</span></div>' +
        '<p class="conf-meta">' + esc(c.venue) + (kind ? ' · ' + esc(kind) : '') + '</p>' +
        (c.original ? '<p class="conf-original">Presented in Chinese; original title: ' + esc(c.original) + '</p>' : '') +
        (c.detail ? '<p class="conf-detail">' + c.detail + '</p>' : '') +
      '</article>';
    }).join('') || '<div class="placeholder">No conferences listed yet.</div>';

    // 页面渲染后再跳到 #conf-xxx 锚点（因为内容是脚本生成的，浏览器自带的跳转会失败）
    if (window.location.hash) {
      var target = document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
  }

  /* ============================================================
     Thinking 列表（标签筛选）
     ============================================================ */
  function renderThinking() {
    Core.setTitle('Thinking');
    $('page-desc').textContent = THINKING.intro || '';
    var posts = THINKING.posts || [];
    var tags = (THINKING.tags || []).filter(function (t) {
      return posts.some(function (p) { return (p.tags || []).indexOf(t.id) >= 0; });
    });

    // 当前选中的标签来自网址 #tag=xxx
    function currentTag() {
      var m = /tag=([^&]*)/.exec(window.location.hash);
      return m ? decodeURIComponent(m[1]) : '';
    }

    function drawFilter() {
      var cur = currentTag();
      var chips = '<span class="filter-label">Topics:</span>' +
        '<a class="chip' + (cur ? '' : ' active') + '" href="#">All<span class="count">' + posts.length + '</span></a>' +
        tags.map(function (t) {
          var n = posts.filter(function (p) { return (p.tags || []).indexOf(t.id) >= 0; }).length;
          return '<a class="chip' + (cur === t.id ? ' active' : '') + '" href="#tag=' + encodeURIComponent(t.id) + '">' + esc(t.label) + '<span class="count">' + n + '</span></a>';
        }).join('');
      $('filter-bar').innerHTML = chips;
      var def = cur ? tagDef(cur) : null;
      $('filter-desc').textContent = def && def.desc ? def.desc : '';
    }

    var metaCache = {};
    function drawList() {
      var cur = currentTag();
      var list = cur ? posts.filter(function (p) { return (p.tags || []).indexOf(cur) >= 0; }) : posts;
      $('thread-list').innerHTML = list.map(function (p) {
        var pm = Core.postMeta(metaCache, p.slug);
        var date = Core.fmtDate(Core.postDate(p, pm));
        return '<a class="thread" href="' + page('post', '?id=' + encodeURIComponent(p.slug)) + '">' +
          '<div class="thread-main">' +
            '<h3 class="thread-title">' + esc(p.title) + '</h3>' +
            '<p class="thread-desc">' + esc(p.summary) + '</p>' +
            '<div class="thread-tags">' + (p.tags || []).map(function (id) { return Core.tagHtml(tagDef(id).label); }).join('') + '</div>' +
          '</div>' +
          '<div class="thread-meta">' + Core.commentHtml(Core.postComments(pm)) +
            '<span class="thread-date">' + esc(date) + '</span></div>' +
        '</a>';
      }).join('') || '<div class="placeholder">No posts under this topic yet.</div>';
    }

    function drawAll() { drawFilter(); drawList(); }
    drawAll();
    Core.loadMeta().then(function (meta) { metaCache = meta; drawList(); });
    window.addEventListener('hashchange', drawAll);
  }

  /* ============================================================
     文章页（post.html?id=<slug>）
     ============================================================ */
  function renderPost() {
    var slug = Core.queryParam('id');
    var post = (THINKING.posts || []).filter(function (p) { return p.slug === slug; })[0];
    if (!post) {
      Core.setTitle('Post not found');
      $('page-title').textContent = 'Post not found';
      $('prose').innerHTML = '<div class="notice">No post with id <code>' + esc(slug) + '</code>. <a href="' + page('thinking') + '">Back to Thinking</a>.</div>';
      return;
    }
    Core.setTitle(post.title);
    $('page-tags').innerHTML = postTagsHtml(post);
    $('page-title').textContent = post.title;
    $('page-desc').textContent = post.summary || '';

    // 元信息：发布日期 / 更新日期 / 评论数（meta.json 到达后填充）
    var metaEl = $('post-meta');
    var drawMeta = function (meta) {
      var pm = Core.postMeta(meta, slug);
      var created = Core.postDate(post, pm);
      var updated = pm.updated;
      var parts = [];
      if (created) parts.push('<span>Published ' + esc(Core.fmtDate(created)) + '</span>');
      if (updated && Core.dayOf(updated) !== Core.dayOf(created)) parts.push('<span>Updated ' + esc(Core.fmtDate(updated)) + '</span>');
      parts.push('<a href="#comments" class="muted">' + Core.commentHtml(Core.postComments(pm)) + '</a>');
      metaEl.innerHTML = parts.join('');
    };
    drawMeta({});
    Core.loadMeta().then(drawMeta);

    Core.renderMarkdown('content/posts/' + slug + '.md', $('prose'));
    Core.mountGiscus($('giscus'), slug);
  }

  /* ============================================================
     根据 <body data-page> 分发
     ============================================================ */
  var renderers = {
    home: renderHome, research: renderResearch, topic: renderTopic,
    publications: renderPublications, activity: renderActivity, conferences: renderConferences,
    thinking: renderThinking, post: renderPost
  };
  var kind = document.body.getAttribute('data-page');
  if (renderers[kind]) renderers[kind]();
})();
