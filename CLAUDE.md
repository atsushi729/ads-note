# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code（および開発者）向けのガイドです。

## プロジェクト概要

**algo notes** — 自作の LeetCode 解答ノート（Markdown）と、データ構造・アルゴリズムの「概念ノート」を
閲覧・管理する Web アプリ。問題ノートと概念ノートが双方向リンクし、習得度・統計を可視化する。

- 設計（正典）: `docs/superpowers/specs/2026-06-28-leetcode-notes-viewer-design.md`
- デザイン参照: `design_handoff_leetcode_notes_viewer/`（README・スクリーンショット・モック・サンプル md）
  - 数値・配色・余白は README を正とし、`screenshots/*.png` を視覚ターゲットとする。

## 技術スタック

- **Next.js (App Router) + TypeScript**、SSG 出力
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

## 将来の拡張（今は未実装、構造だけ用意）

- LLM チャット機能（ストリーミング応答）。`app/api/chat/route.ts` を予約済み（現状 501 スタブ）。
- 後日 Vercel AI SDK (`ai`) + `useChat` を追加し、無料 API（Groq / Gemini / OpenRouter）を差し替える。
- API キーはサーバー専用 `.env`。クライアントに晒さない。
