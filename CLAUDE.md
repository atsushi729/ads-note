# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code（および開発者）向けのガイドです。

## プロジェクト概要

**algo notes** — 自作の LeetCode 解答ノート（Markdown）と、データ構造・アルゴリズムの「概念ノート」を
閲覧・管理する Web アプリ。問題ノートと概念ノートが双方向リンクし、習得度・統計を可視化する。

- 設計（正典）: `docs/superpowers/specs/2026-06-28-leetcode-notes-viewer-design.md`
- デザイン参照: `design_handoff_leetcode_notes_viewer/`（README・スクリーンショット・モック・サンプル md）
  - 数値・配色・余白は README を正とし、`screenshots/*.png` を視覚ターゲットとする。

## 技術スタック

- **Next.js (App Router) + TypeScript**。Cloudflare Workers へ `@opennextjs/cloudflare` でデプロイ（問題/概念は SSG、`/chat`・`/api/chat` は動的）
- **Tailwind CSS**（デザイントークンを CSS 変数化し、`:root` / `.dark` で light/dark 切替）
- Markdown: `gray-matter` + `react-markdown` + `remark-gfm` + `remark-math` + `rehype-katex`
- コードハイライト: `rehype-pretty-code`（shiki, `github-light` / `github-dark`）
- 数式: `katex`
- アイコン: `lucide-react`
- フォント: `next/font/google`（Hanken Grotesk, JetBrains Mono）
- テスト: Vitest + React Testing Library

## ディレクトリ規約

- `app/` — ルート。問題ライブラリ `/`、問題詳細 `/problems/[number]`、概念ライブラリ `/concepts`、概念詳細 `/concepts/[id]`
- `components/` — `layout/` `library/` `detail/` `search/` `markdown/` に分類
- `content/` — `problems/*.md`（1問題=1md）、`concepts/*.md`（frontmatter + 学習メモ本文）
- `lib/` — ビルド時パース（`problems.ts` `concepts.ts` `parse-steps.ts` `links.ts` `search-index.ts` `types.ts`）
- `styles/` — `globals.css` `tokens.css`
- `design_handoff_leetcode_notes_viewer/` — 参照資料。**編集しない**

## データモデル

`lib/types.ts` の `Problem` / `Step` / `Concept` を正とする。
双方向リンクは `Problem.conceptIds` ↔ `Concept.problemNumbers`。

問題 Markdown の構造（`content/problems/*.md`）:
- フロントマター: `title, source, created, description, tags[]`
- 本文: `## Question` / `## Approach` → `### Step N` → `#### 思考 / 実装 / パフォーマンス / 注意点`
- 計算量は `Time complexity : $O(h)$` / `Space complexity: $O(1)$` 形式（パーサが抽出）

## コマンド（実装後に有効）

```bash
npm run dev      # 開発サーバー
npm run build    # SSG ビルド
npm run test     # Vitest
npm run lint     # Lint
```

## 開発方針

- 既存のデザイントークン・コンポーネントパターンに従う。新規の色や余白を発明しない（README のトークンを使う）。
- コンテンツのパース・整形は **ビルド時** に行い、クライアントへはパース済みデータを渡す（SSG）。
- インタラクション（⌘K パレット、フィルタ、Step 折りたたみ、テーマ切替）のみ Client Component に分離。
- `parse-steps.ts` は最重要ユニット。変更時は必ずテスト（サンプル 701.md）を走らせる。
- ライト/ダーク両テーマを常に確認する。

## LLM チャット機能（実装済み）

- 専用ページ `/chat`。文脈連動: 右上で問題/概念ノートを選ぶ（または `/chat?problem=701` / `/chat?concept=stack` で deep-link）と、その内容を system prompt に注入して回答する。問題・概念の詳細ページに「AIに質問」導線あり。
- ストリーミング: Vercel AI SDK v5系 (`ai` / `@ai-sdk/react` の `useChat`)。`app/api/chat/route.ts` が `streamText().toUIMessageStreamResponse()` を返す。
- **プロバイダは差し替え可能**（`lib/ai/provider.ts`）。既定は Cloudflare Workers AI（外部キー不要、`env.AI` binding）。環境変数 `CHAT_PROVIDER`（`workers-ai` | `google` | `groq`）＋ `CHAT_MODEL` で切替。google/groq はキー必須（`GOOGLE_GENERATIVE_AI_API_KEY` / `GROQ_API_KEY`）。
- 文脈整形は `lib/ai/context.ts`（`buildSystemPrompt` / `serializeProblemContext` / `serializeConceptContext`、いずれもテスト済みの純関数）。
- API キーは `wrangler secret` でサーバー専用。クライアントに晒さない。

## デプロイ（Cloudflare Workers / OpenNext）

- `@opennextjs/cloudflare` で Worker としてデプロイ（**純 SSG export ではない**。`next.config.ts` から `output: "export"` は削除済み）。問題/概念ページは引き続き SSG、`/chat`・`/api/chat` のみ動的。
- 設定: `wrangler.jsonc`（`ai` binding=`AI`、`vars.CHAT_PROVIDER`）、`open-next.config.ts`。
- コマンド: `npm run preview`（ローカルで Worker をプレビュー）、`npm run deploy`（ビルド＋`wrangler deploy`）、`npm run cf-typegen`（binding 型生成）。
- **実行時 fs 不可**: Worker ランタイムに `fs` が無い。`content/*.md` は `scripts/gen-content.mjs` が `lib/content-data.ts`（gitignore・生成物）へインライン化し、`lib/problems.ts`/`lib/concepts.ts` はそこからパースする。`gen:content` は predev/prebuild/pretest と preview/deploy に組み込み済み。
- **workers-ai-provider のパッチ**: `patches/workers-ai-provider+3.2.1.patch`（SSEトークン二重 emit の修正）を `postinstall` の patch-package で適用。パッチ変更時は webpack キャッシュのため `rm -rf .next` してから再ビルド。
- Workers AI モデルは廃止されることがある（現行は `npx wrangler ai models` で確認）。既定モデルは `lib/ai/provider.ts` の `DEFAULT_MODELS`。
- 検証は必ず `npm run preview` で実機確認（`next build` だけでは上記の実行時問題を検出できない）。
