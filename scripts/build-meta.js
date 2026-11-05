#!/usr/bin/env node
/* ============================================================
   scripts/build-meta.js —— 生成 assets/data/meta.json
   ------------------------------------------------------------
   ★ 由 GitHub Actions（.github/workflows/deploy.yml）在每次部署时自动运行，
     平时不需要手动执行。

   做两件事：
     1. 文章日期：扫描 content/posts/*.md，用 git 历史得到每篇文章
        第一次提交的日期（created）与最近一次修改的日期（updated）。
     2. 评论数：通过 GitHub GraphQL API 读取仓库 Discussions（giscus 的后端），
        按标题 "<termPrefix><slug>" 匹配到文章，统计评论数 / 回复数 / 表情数。
        需要环境变量 GITHUB_TOKEN（Actions 自动提供）；没有 token 时跳过这一步。

   输出格式（assets/data/meta.json）：
     {
       "generatedAt": "2026-11-10T03:17:00.000Z",
       "posts": {
         "tc-frequency": {
           "created": "2026-11-09T12:00:00+08:00",
           "updated": "2026-11-20T09:30:00+08:00",
           "comments": 3, "replies": 1, "reactions": 2,
           "url": "https://github.com/<owner>/<repo>/discussions/5"
         }
       }
     }

   本地调试：在仓库根目录运行  node scripts/build-meta.js
     - 有 .git 目录时能算出日期；没有则用文件修改时间代替。
     - 设置环境变量 GITHUB_TOKEN=<个人 token> 可同时拉取评论数。
   任何一步失败都不会让脚本报错退出（避免阻断部署），只会在日志里提示。
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const OUT_FILE = path.join(ROOT, 'assets', 'data', 'meta.json');

const SITE = require(path.join(ROOT, 'content', 'site.js'));
const REPO = process.env.GITHUB_REPOSITORY || SITE.repo;      // "owner/name"
const TOKEN = process.env.GITHUB_TOKEN || '';
const TERM_PREFIX = (SITE.giscus && SITE.giscus.termPrefix) || '';

/* ---------------- 1. 文章日期（git 历史） ---------------- */

function git(args) {
  return execSync('git ' + args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

function fileDates(relPath) {
  try {
    // --reverse 后第一行 = 最早一次提交；-1 = 最近一次提交。%aI = 作者时间（ISO 8601）
    const all = git(`log --follow --format=%aI --reverse -- "${relPath}"`).split('\n').filter(Boolean);
    if (all.length) return { created: all[0], updated: all[all.length - 1] };
  } catch (e) { /* 不是 git 仓库或文件尚未提交 */ }
  // 兜底：文件系统时间（本地预览用）
  const st = fs.statSync(path.join(ROOT, relPath));
  const birth = st.birthtime && st.birthtime.getTime() > 0 ? st.birthtime : st.mtime;
  return { created: birth.toISOString(), updated: st.mtime.toISOString() };
}

function collectPosts() {
  const posts = {};
  if (!fs.existsSync(POSTS_DIR)) return posts;
  for (const f of fs.readdirSync(POSTS_DIR)) {
    if (!f.endsWith('.md')) continue;
    const slug = f.slice(0, -3);
    posts[slug] = fileDates(path.posix.join('content', 'posts', f));
  }
  return posts;
}

/* ---------------- 2. 评论数（GitHub Discussions, GraphQL） ---------------- */

async function fetchDiscussions() {
  const [owner, name] = REPO.split('/');
  const query = `
    query($owner: String!, $name: String!, $after: String) {
      repository(owner: $owner, name: $name) {
        discussions(first: 100, after: $after) {
          pageInfo { hasNextPage endCursor }
          nodes {
            title url
            reactions { totalCount }
            comments(first: 100) { totalCount nodes { replies { totalCount } } }
          }
        }
      }
    }`;

  const byTitle = {};
  let after = null;
  for (let page = 0; page < 20; page++) {           // 最多 2000 条讨论，足够
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { 'Authorization': 'bearer ' + TOKEN, 'Content-Type': 'application/json', 'User-Agent': 'build-meta' },
      body: JSON.stringify({ query, variables: { owner, name, after } })
    });
    const json = await res.json();
    if (json.errors) throw new Error(JSON.stringify(json.errors));
    const d = json.data.repository.discussions;
    for (const n of d.nodes) {
      const replies = n.comments.nodes.reduce((s, c) => s + c.replies.totalCount, 0);
      byTitle[n.title] = { comments: n.comments.totalCount, replies, reactions: n.reactions.totalCount, url: n.url };
    }
    if (!d.pageInfo.hasNextPage) break;
    after = d.pageInfo.endCursor;
  }
  return byTitle;
}

/* ---------------- 主流程 ---------------- */

(async function main() {
  const posts = collectPosts();
  console.log(`[meta] ${Object.keys(posts).length} post(s) found in content/posts/`);

  // 评论数：只有成功访问到 Discussions API 时才写入数字（没有讨论的文章记 0）；
  // 没有 token 或接口报错时不写，页面会显示 "–" 而不是误导性的 0。
  let discussions = null;
  if (TOKEN) {
    try {
      discussions = await fetchDiscussions();
      console.log(`[meta] ${Object.keys(discussions).length} discussion(s) fetched from ${REPO}`);
    } catch (e) {
      console.log('[meta] Could not fetch discussions (is Discussions enabled on the repo?):', e.message);
    }
  }

  if (discussions) {
    for (const slug of Object.keys(posts)) {
      const d = discussions[TERM_PREFIX + slug];
      Object.assign(posts[slug], d || { comments: 0, replies: 0, reactions: 0 });
    }
  }

  const out = { generatedAt: new Date().toISOString(), repo: REPO, posts };
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2) + '\n');
  console.log(`[meta] written ${path.relative(ROOT, OUT_FILE)}`);
})().catch(e => {
  console.log('[meta] unexpected error, writing empty meta:', e.message);
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), posts: {} }, null, 2) + '\n');
});
