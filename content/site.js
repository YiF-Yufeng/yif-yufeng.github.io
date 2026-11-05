/* ============================================================
   content/site.js —— 全站配置（很少需要改动）
   ------------------------------------------------------------
   这里只放"整站级"的设置：GitHub 仓库、giscus 评论区参数、导航菜单。
   个人信息请改 content/profile.js；各栏目内容请改对应的 content/*.js。

   ★ 上线前必须填写的两项：giscus.repoId 与 giscus.categoryId
     获取方法见 README「评论区（giscus）配置」一节。
   ============================================================ */

var SITE = {

  /* GitHub 仓库 "用户名/仓库名"。
     用途：giscus 评论存放位置；GitHub Actions 读取 Discussions 评论数。 */
  repo: 'YiF-Yufeng/yif-yufeng.github.io',

  /* 站点标题后缀（浏览器标签页显示为 "页面名 · Yufeng Zhou"） */
  titleSuffix: 'Yufeng Zhou',

  /* 顶部导航菜单：label 为显示文字，page 对应 pages/ 下的文件名（不含 .html）。
     一般不需要改。若要调整顺序，直接调整数组顺序即可。 */
  nav: [
    { label: 'Research',     page: 'research' },
    { label: 'Publications', page: 'publications' },
    { label: 'Activity',     page: 'activity' },
    { label: 'Thinking',     page: 'thinking' }
  ],

  /* giscus 评论区配置（https://giscus.app）
     - repoId / categoryId：在 giscus.app 页面填入仓库名后自动生成，复制过来即可。
       未填写（仍为 REPLACE_WITH_...）时，文章页会显示一条"评论区尚未配置"的提示，不会报错。
     - category：存放评论的 Discussions 分类名，建议新建一个 "Thinking" 或使用默认 "Announcements"。
     - termPrefix：每篇文章对应的 Discussion 标题前缀，最终标题形如 "thinking/tc-frequency"。
       ★ 部署后请勿更改，否则已有评论会与文章脱钩。 */
  giscus: {
    repoId:     'REPLACE_WITH_REPO_ID',
    category:   'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
    termPrefix: 'thinking/'
  },

  /* 首页 Thinking 区块最多显示几篇最新文章 */
  homeThinkingCount: 6
};

/* 让 scripts/build-meta.js（Node 环境）也能读取同一份配置；浏览器中此行无作用 */
if (typeof module !== 'undefined' && module.exports) { module.exports = SITE; }
