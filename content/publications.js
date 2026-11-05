/* ============================================================
   content/publications.js —— Publications 页：论文列表
   ------------------------------------------------------------
   新增一篇论文：复制一个 { ... } 对象粘到 items 数组里即可（位置无所谓，
   页面会自动按 年份倒序 排列，并自动分成 First-Author / Co-Authored 两组）。

   字段说明：
     title        论文标题
     authors      作者列表，按期刊写法用逗号分隔。你自己的署名会自动加粗
                  （加粗依据 profile.js 中的 authorNames）。
     venue        期刊名
     volume       卷/页码/文章号（可选）
     year         年份（数字），用于排序
     doi          DOI（不带 https://doi.org/ 前缀）。有 DOI 时标题自动变成可点击链接。
     status       'published' | 'submitted' | 'in-prep'
                  （已发表 / 在投 / 撰写中），决定右侧状态标签的文字与颜色
     firstAuthor  true 表示第一作者（或通讯作者），会放在 First-Author 组
     summary      一句话介绍（可选，一般只给一作文章写）

   showUnpublished：
     false → 只显示 status 为 'published' 的论文（在投/撰写中的先隐藏）
     true  → 全部显示
   ============================================================ */

var PUBLICATIONS = {

  intro: 'Peer-reviewed journal papers.',

  showUnpublished: false,

  items: [

    /* ---------------- 第一作者 ---------------- */
    {
      title:   'A Hierarchical Organization Index for Tropical Convection across Models and Observations',
      authors: 'Zhou, Y., Dong, W., & Lin, Y.',
      venue:   'Journal of Advances in Modeling Earth Systems',
      volume:  '18, e2026MS005814',
      year:    2026,
      doi:     '10.1029/2026MS005814',
      status:  'published',
      firstAuthor: true,
      summary: 'Introduces an entropy-based Hierarchical Organization Index that quantifies tropical convective organization consistently across models and observations.'
    },
    {
      title:   'Shortened intensification duration offsets the increase of tropical cyclone lifetime maximum intensity',
      authors: 'Zhou, Y., & Lin, Y.',
      venue:   'npj Climate and Atmospheric Science',
      volume:  '9, 22',
      year:    2026,
      doi:     '10.1038/s41612-025-01295-3',
      status:  'published',
      firstAuthor: true,
      summary: 'Shows that a shortened intensification duration offsets the projected increase in tropical cyclone lifetime maximum intensity.'
    },
    {
      title:   'Shrinking cold wakes accelerate tropical cyclone intensification in recent decades',
      authors: 'Zhou, Y., Shan, K., & Lin, Y.',
      venue:   'npj Climate and Atmospheric Science',
      volume:  '9, 25',
      year:    2026,
      doi:     '10.1038/s41612-025-01300-9',
      status:  'published',
      firstAuthor: true,
      summary: 'Quantifies the weakening of tropical-cyclone-induced ocean cooling and links it to faster intensification in recent decades.'
    },
    {
      title:   'A toy model for the global annual number of tropical cyclones',
      authors: 'Zhou, Y., & Lin, Y.',
      venue:   "Earth's Future",
      volume:  '12, e2024EF004839',
      year:    2024,
      doi:     '10.1029/2024EF004839',
      status:  'published',
      firstAuthor: true,
      summary: 'Proposes a simple model that explains why the global annual number of tropical cyclones hovers around 90.'
    },

    /* 一作 · 未发表（showUnpublished 为 false 时不显示） */
    {
      title:   'An Information-Theoretic Approach Reveals Evolving Infrared Brightness Temperature Thresholds for Tropical Convection',
      authors: 'Zhou, Y., Dong, W., & Lin, Y.',
      venue:   'Journal of Geophysical Research: Atmospheres',
      year:    2026,
      status:  'submitted',
      firstAuthor: true
    },
    {
      title:   'Temporal Organization of Tropical Cyclone Genesis: Linking Frequency to Inter-Event Time Statistics',
      authors: 'Zhou, Y., & Lin, Y.',
      venue:   '',
      year:    2026,
      status:  'in-prep',
      firstAuthor: true
    },
    {
      title:   'Observed Increase in Global Tropical Cyclone Track Curvature and Short-Term Motion Variability',
      authors: 'Zhou, Y., & Lin, Y.',
      venue:   '',
      year:    2026,
      status:  'in-prep',
      firstAuthor: true
    },

    /* ---------------- 合著 ---------------- */
    {
      title:   'Tropical cyclones cool the climate compared with regular convection',
      authors: 'Lin, Y., Zhang, J., Zhou, Y., & Zhang, M.',
      venue:   'Journal of Meteorological Research',
      volume:  '40(6), 1–12',
      year:    2026,
      doi:     '10.1007/s13351-027-6113-1',
      status:  'published',
      firstAuthor: false
    },
    {
      title:   'Drying effect of landfalling tropical cyclones',
      authors: 'Yang, Y., Ma, Z., Lin, Y., Zhou, Y., & Fei, J.',
      venue:   'Geophysical Research Letters',
      volume:  '53, e2025GL121284',
      year:    2026,
      doi:     '10.1029/2025GL121284',
      status:  'published',
      firstAuthor: false
    },
    {
      title:   'Abrupt decrease in tropical cyclone lifetime-maximum size in the western North Pacific since the late 20th century',
      authors: 'Wang, C., Shan, K., Zhou, Y., Lin, Y., & Yu, X.',
      venue:   'Geophysical Research Letters',
      volume:  '52, e2025GL115918',
      year:    2025,
      doi:     '10.1029/2025GL115918',
      status:  'published',
      firstAuthor: false
    },

    /* 合著 · 未发表 */
    {
      title:   'Compound climate hazards erode energy-system resilience through transmission infrastructure',
      authors: 'Sun, Y., Wei, W., Yu, Y., Lu, H., Zhang, N., Jian, Y., Gesang, Y., Debnath, R., Davis, S., Zhou, Y., Zhang, Q., & He, K.',
      venue:   'Nature Energy',
      year:    2026,
      status:  'submitted',
      firstAuthor: false
    },
    {
      title:   'Global warming amplifies coastal risks in East Asia as tropical cyclones strike farther north and slow down',
      authors: 'Wu, T., Zhou, Y., Lin, Y., Duan, Z., Zhao, H., & Shan, K.',
      venue:   '',
      year:    2026,
      status:  'in-prep',
      firstAuthor: false
    }
  ]
};
