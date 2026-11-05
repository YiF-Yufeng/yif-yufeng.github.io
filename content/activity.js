/* ============================================================
   content/activity.js —— Activity 页：会议报告 / 学术服务 / 荣誉奖励
   ------------------------------------------------------------
   Activity 页的三个区块，以及 Conferences 页（全部会议详情）都来自这里。

   ★ 会议报告（conferences）：按时间倒序，最新放最前面。新增一条就复制一个对象。
     字段：
       id        唯一编号（建议 年月 + 简写，如 '202608-hoi'），是详情页的锚点：
                 pages/conferences.html#conf-<id>
       date      'YYYY-MM'
       type      'Oral' | 'Poster' | 'Invited' | 'Keynote' ... 显示在卡片标签上
       award     获奖名称（可选），有则在标签与详情中突出显示
       title     报告题目（英文）
       original  原文题目（可选，报告为中文时填写，仅在 Conferences 页小字显示）
       venue     会议名称与地点（英文）
       detail    详情（可选）：摘要、slides/视频链接等，可写 HTML
   ============================================================ */

var ACTIVITY = {

  intro: 'Conferences, honors, and academic service.',

  /* ---------------- 会议报告 ---------------- */
  conferences: [
    {
      id:       '202608-hoi',
      date:     '2026-08',
      type:     'Oral',
      title:    'An Entropy-Based Hierarchical Organization Index (HOI) for Tropical Convection and Its Application to Models and Observations',
      original: '基于信息熵的热带对流层级组织指数（HOI）及其在模式与观测中的应用',
      venue:    'The 8th National Forum on Mesoscale Meteorology, Chengdu, China',
      detail:   ''
    },
    {
      id:       '202512-packing',
      date:     '2025-12',
      type:     'Oral',
      title:    'A Spatiotemporal-Packing Model for the Global Annual Number of Tropical Cyclones',
      original: '基于时空填充的全球台风年频数的模型',
      venue:    'Workshop on Applied Mathematics, AI Methods and Earth System Complexity, Beijing, China',
      detail:   ''
    },
    {
      id:       '202507-aogs',
      date:     '2025-07',
      type:     'Oral',
      title:    'The Role of Intensification Duration in Shaping Tropical Cyclone Lifetime Maximum Intensity Distribution',
      venue:    'AOGS 2025 Annual Meeting, Singapore',
      detail:   ''
    },
    {
      id:       '202504-packing',
      date:     '2025-04',
      type:     'Oral',
      title:    'A Spatiotemporal-Packing Model for the Global Annual Number of Tropical Cyclones',
      original: '基于时空填充的全球台风年频数的模型',
      venue:    'The 1st Future Atmospheric Science Forum, Beijing, China',
      detail:   ''
    },
    {
      id:       '202411-frequency',
      date:     '2024-11',
      type:     'Oral',
      title:    'A Model for Global Tropical Cyclone Frequency',
      original: '全球热带气旋频数的模型',
      venue:    'The 6th National Forum on Mesoscale Meteorology, Zhuhai, China',
      detail:   ''
    },
    {
      id:       '202405-ams',
      date:     '2024-05',
      type:     'Poster',
      award:    'Best Student Poster Award',
      title:    'A Toy Model for the Global Annual Number of Tropical Cyclones',
      venue:    '36th AMS Conference on Hurricanes and Tropical Meteorology, Long Beach, USA',
      detail:   ''
    }
  ],

  /* ---------------- 学术服务 ----------------
     每个元素一条；label 加粗显示，text 为正文（可写 HTML）。 */
  service: [
    {
      label: 'Journal Reviewer',
      text:  'Geophysical Research Letters; Journal of Climate; Communications Earth &amp; Environment; npj Climate and Atmospheric Science; Journal of Geophysical Research: Atmospheres.'
    },
    {
      label: 'Teaching Assistant',
      text:  'Introduction to Meteorology (Prof. Yanluan Lin &amp; Assoc. Prof. Yiran Peng, 2021–2022); Advanced Synoptic Meteorology (Prof. Yanluan Lin, 2024–2025).'
    }
  ],

  /* ---------------- 荣誉奖励（按时间倒序） ----------------
     name 为奖项名称，meta 为颁发单位 / 年份等小字说明。 */
  honors: [
    { name: 'National Scholarship for Doctoral Students',          meta: 'Ministry of Education · 2024' },
    { name: 'Tsinghua University Comprehensive Scholarship',       meta: '2022, 2023, 2025' },
    { name: 'Best Student Poster Award',                           meta: '36th AMS Conference on Hurricanes and Tropical Meteorology · 2024' },
    { name: 'Founder &amp; First President, Tsinghua University Student Association of Meteorology', meta: '2021 – 2025' }
  ]
};
