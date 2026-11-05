/* ============================================================
   content/thinking.js —— Thinking 栏目：标签定义 + 文章索引
   ------------------------------------------------------------
   首页的 Thinking 卡片、Thinking 页的文章列表与标签筛选、以及每篇文章页
   （pages/post.html?id=<slug>）的标题/摘要/标签都来自这里。
   文章正文写在 content/posts/<slug>.md（Markdown）。

   ★ 新增一篇文章只需两步：
     1. 在 posts 数组【最前面】插入一个对象（列表按数组顺序显示，最新在前）；
     2. 新建 content/posts/<slug>.md 写正文。
   slug 只能用小写字母、数字和短横线，且与 .md 文件名一致。
   ★ 文章发布后不要再改 slug，否则评论区会与文章脱钩。

   ★ 日期与评论数都是自动的，不需要手填：
     - 发布日期 = 该 .md 文件第一次 push 到 GitHub 的日期；
       更新日期 = 最近一次修改的日期（有修改时文章页会显示 "Updated ..."）。
     - 评论数 = 该文章 giscus 讨论区里的真实评论 + 回复数。
     两者由 GitHub Actions 在每次部署时写入 assets/data/meta.json（见 README）。
     - 如确需手动指定发布日期（例如旧文章搬运），可加 date: 'YYYY-MM-DD'，
       手动日期优先于自动日期。

   字段说明：
     slug     文章唯一标识 = 网址 = 正文文件名
     title    标题
     summary  一两句摘要（列表与卡片中显示）
     tags     标签 id 列表（必须在下方 tags 中定义），可多个
     date     （可选）手动指定发布日期 'YYYY-MM-DD'
   ============================================================ */

var THINKING = {

  /* Thinking 页顶部的一句话说明 */
  intro: 'Ongoing thoughts and open questions, grouped by topic. Each post has a discussion thread at the end — comments are welcome.',

  /* ---------------- 标签（分组）定义 ----------------
     id 用于筛选与网址（pages/thinking.html#tag=<id>），label 为显示文字，
     desc 为选中该标签时显示的一句话说明（可选）。
     新增分组：加一行；删除分组前请确认没有文章在用。 */
  tags: [
    { id: 'tc-frequency',   label: 'TC frequency',             desc: 'Why the globe produces roughly 90 tropical cyclones a year, and what sets that number.' },
    { id: 'organization',   label: 'Convective organization',  desc: 'Quantifying how tropical convection clusters, and how that depends on the way we identify convective systems.' },
    { id: 'tc-change',      label: 'TC characteristics',       desc: 'Changes in tropical cyclone intensity, air–sea interaction and motion in a warming climate.' },
    { id: 'methods',        label: 'Methods',                  desc: 'Statistical and information-theoretic tools, idealized models, and how to read them.' }
  ],

  /* ---------------- 文章索引（最新在前） ---------------- */
  posts: [
    {
      slug:    'tc-frequency',
      title:   'Why does the globe produce about 90 tropical cyclones a year?',
      summary: 'On the remarkable stability of the global annual TC count, viewed through spatiotemporal packing and a finite carrying capacity.',
      tags:    ['tc-frequency']
    },
    {
      slug:    'hoi',
      title:   'Measuring convective organization with information entropy',
      summary: 'How the Hierarchical Organization Index (HOI) is constructed, what it captures, and how to interpret it.',
      tags:    ['organization', 'methods']
    },
    {
      slug:    'threshold',
      title:   'Choosing a brightness-temperature threshold for convective systems',
      summary: 'How the infrared threshold shapes organization metrics, and how to pick one that is robust.',
      tags:    ['organization', 'methods']
    },
    {
      slug:    'packing-capacity',
      title:   'Spatiotemporal packing and the “carrying capacity” for tropical cyclones',
      summary: 'A bin-packing view of the finite capacity of the tropical atmosphere.',
      tags:    ['tc-frequency']
    },
    {
      slug:    'intensification',
      title:   'Decomposing TC intensity into intensification rate and duration',
      summary: 'Splitting lifetime maximum intensity into a rate and a duration, and looking at their separate climate responses.',
      tags:    ['tc-change']
    },
    {
      slug:    'cold-wake',
      title:   'Ocean cold wakes and TC–ocean coupling',
      summary: 'How shrinking cold wakes feed back on intensification and air–sea coupling.',
      tags:    ['tc-change']
    }
  ]
};
