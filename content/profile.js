/* ============================================================
   content/profile.js —— 首页个人信息
   ------------------------------------------------------------
   首页顶部（姓名/照片/头衔/联系方式）与 About 区块（自我介绍/教育经历）
   全部来自这个文件。页脚的邮箱也取自这里。

   修改方法：直接改引号里的文字。
   - 需要换行的长段落，用数组写多段（见 bio）。
   - 文字里可以直接写 HTML 标签，例如 <em>斜体</em>、<a href="...">链接</a>。
   - 照片：替换 assets/images/photo.jpg（建议正方形，≥ 600×600）。
   ============================================================ */

var PROFILE = {

  /* ---------- 基本信息 ---------- */
  name:   'Yufeng Zhou',
  nameZh: '周宇峰',                                   // 显示在英文名旁边的中文名，不需要可留空 ''
  /* 论文作者列表中你的署名写法，用于在 Publications 页自动加粗，可写多种写法 */
  authorNames: ['Zhou, Y.', 'Y. Zhou', 'Yufeng Zhou'],

  role:        'Ph.D. Candidate in Atmospheric Science',
  affiliation: 'Department of Earth System Science, Tsinghua University',
  tagline:     'I study the physical constraints that govern tropical cyclone frequency and its response to climate change.',

  photo: 'assets/images/photo.jpg',
  email: 'zyf21@mails.tsinghua.edu.cn',

  /* ---------- 联系方式 / 外部链接按钮 ----------
     icon 可选：email / researchgate / github / scholar / orcid / twitter / link
     不需要的删掉即可；新增一个就复制一行。 */
  links: [
    { label: 'Email',        icon: 'email',        url: 'mailto:zyf21@mails.tsinghua.edu.cn' },
    { label: 'ResearchGate', icon: 'researchgate', url: 'https://www.researchgate.net/profile/Yufeng-Zhou-11' },
    { label: 'GitHub',       icon: 'github',       url: 'https://github.com/yif-yufeng' }
    // { label: 'Google Scholar', icon: 'scholar', url: 'https://scholar.google.com/citations?user=XXXX' },
    // { label: 'ORCID',          icon: 'orcid',   url: 'https://orcid.org/0000-0000-0000-0000' },
  ],

  /* ---------- About：自我介绍（每个元素是一段） ---------- */
  bio: [
    'I am a Ph.D. candidate in the Department of Earth System Science at Tsinghua University, advised by Prof. Yanluan Lin. My research focuses on identifying the physical constraints that govern tropical cyclone frequency and understanding its response to climate change. Beyond this, I am broadly interested in multiscale climate dynamics, extreme weather, idealized modeling, and complex-system perspectives on the Earth system.',
    'I enjoy identifying and discovering emerging patterns in complex climate systems, and proposing novel mathematical and physical approaches to address fundamental questions in atmospheric and climate sciences.'
  ],

  /* ---------- About：教育经历（按时间倒序，最新在前） ----------
     note 为可选的小字补充（如预计毕业时间），不需要可删掉该行。 */
  education: [
    {
      period: 'Aug 2021 – present',
      note:   'expected Dec 2026',
      degree: 'Ph.D. in Atmospheric Science',
      detail: 'Department of Earth System Science, Tsinghua University · Advisor: Prof. Yanluan Lin'
    },
    {
      period: 'Aug 2017 – Jun 2021',
      degree: 'B.Eng. in Engineering Physics',
      detail: 'Department of Engineering Physics, Tsinghua University'
    },
    {
      period: 'Aug 2018 – Jun 2021',
      degree: 'Minor in Statistics',
      detail: 'Department of Industrial Engineering, Tsinghua University'
    }
  ]
};
