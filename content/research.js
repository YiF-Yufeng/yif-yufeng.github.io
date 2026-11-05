/* ============================================================
   content/research.js —— Research 页：研究主题索引
   ------------------------------------------------------------
   Research 页的大卡片、以及每个主题详情页（pages/topic.html?id=xxx）
   的标题/标签/摘要都来自这里。详情页的正文写在 content/research/<id>.md。

   新增一个研究主题的步骤：
     1. 在下方 topics 数组中复制一个对象，填好 id / title / tag / summary；
     2. 新建 content/research/<id>.md 写正文（Markdown，可含图片与公式）；
     3. （可选）准备一张封面图放到 assets/images/，填入 image。
   id 只能用小写字母、数字和短横线，它同时是详情页网址：pages/topic.html?id=<id>

   字段说明：
     tag          卡片左上角的小标签，如 'Dissertation' / 'Methods' / 'Climate Response'
     tagStyle     标签颜色：'amber'（橙，用于突出）或 'blue'（默认蓝）
     publications 相关论文的 DOI 列表（需与 publications.js 中的 doi 一致），
                  详情页底部会自动列出这些论文；不需要可删掉该行。
   ============================================================ */

var RESEARCH = {

  /* Research 页顶部的一句话说明 */
  intro: 'My research interests, organized into a few ongoing threads. Click any topic to read more.',

  topics: [
    {
      id:       'packing',
      title:    'A Spatiotemporal Packing Framework for Tropical Cyclone Frequency',
      tag:      'Dissertation',
      tagStyle: 'amber',
      image:    'assets/images/research-packing.svg',
      summary:  'Proposes a framework showing that global tropical cyclone (TC) frequency emerges from the spatiotemporal packing and self-organization of the tropical climate system under finite environmental constraints — linking spatial convective organization, genesis interval statistics, and TC lifecycle effects.',
      publications: ['10.1029/2024EF004839']
    },
    {
      id:       'hoi',
      title:    'Information-Theoretic Quantification of Tropical Convective Organization',
      tag:      'Methods',
      tagStyle: 'blue',
      image:    'assets/images/research-hoi.svg',
      summary:  'Develops an entropy-based Hierarchical Organization Index (HOI) and a dual-metric framework integrating size hierarchy and spatial clustering, identifying an adaptive structure-optimal infrared brightness temperature threshold and its long-term cooling trend.',
      publications: ['10.1029/2026MS005814']
    },
    {
      id:       'tc-change',
      title:    'Climate-Driven Changes in Tropical Cyclone Characteristics',
      tag:      'Climate Response',
      tagStyle: 'blue',
      image:    'assets/images/research-tc-change.svg',
      summary:  'Reveals changes in TC intensity, air–sea interaction, and motion variability by decomposing lifetime maximum intensity into intensification rate and duration, quantifying the weakening of TC-induced ocean cooling, and identifying increasing track curvature.',
      publications: ['10.1038/s41612-025-01295-3', '10.1038/s41612-025-01300-9']
    }
  ]
};
