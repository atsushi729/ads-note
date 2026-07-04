# algo notes — LeetCode Notes Viewer

自作の LeetCode 解答ノート（Markdown）と、データ構造・アルゴリズムの「概念ノート」を
快適に閲覧・管理する Web アプリ。問題ノートと概念ノートが双方向リンクする。

## 主な機能

- 問題ライブラリ（カード一覧、難易度/タグフィルタ、統計サマリー）
- 問題詳細（目次ジャンプ、本文、制約の LaTeX 表示、Step 単位の折りたたみ、シンタックスハイライト、計算量表示）
- ⌘K コマンドパレット検索（問題名・タグ・本文を横断）
- 概念ライブラリ（カード一覧）／概念詳細（計算量テーブル、関連問題への双方向リンク、学習メモ）
- ライト / ダークのテーマ切替、モバイル対応

## 技術スタック

Next.js (App Router) + TypeScript / Tailwind CSS / gray-matter + react-markdown + remark-math + rehype-katex /
rehype-pretty-code（shiki）/ KaTeX / lucide-react / Vitest + React Testing Library。

## 前提

- Node.js 20 以上
- npm

## 起動方法（クイックスタート）

```bash
# 1. 依存をインストール
npm install

# 2. 開発サーバーを起動（http://localhost:3000）
npm run dev
```

ブラウザで <http://localhost:3000> を開く。トップが問題ライブラリ、`/concepts` が概念ライブラリ。
`⌘K`（macOS）/ `Ctrl+K`（Windows）でコマンドパレット検索が開く。

## スクリプト

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバー（ホットリロード） |
| `npm run build` | 本番ビルド（SSG、`out/` に静的出力） |
| `npm run start` | ビルド済みアプリを起動 |
| `npm run test` | Vitest でテスト実行（一回） |
| `npm run test:watch` | テストをウォッチ実行 |
| `npm run lint` | Lint |

## コンテンツの追加

問題・概念はすべて Markdown で `content/` に置く（ビルド時にパースされる）。

### 問題（`content/problems/<番号>-<slug>.md`）

```markdown
---
number: 1
title: Two Sum
source: https://leetcode.com/problems/two-sum/
created: 2026-05-04
difficulty: Easy
solved: true
tags: [Array, Hash]
conceptIds: [hash-table]      # 概念への双方向リンク
stepTitles: [ブルートフォース, ハッシュで一回走査]
---
# Two Sum
- Difficulty: Easy

## Question
…本文… （Example は ``` フェンス、Constraints は `$...$` で LaTeX）

## Approach
### Step 1
#### 思考
 - …箇条書き…
#### 実装
```python
# コード
```
#### パフォーマンス
 - Time complexity : $O(n^2)$
 - Space complexity: $O(1)$
#### 注意点   # 任意
 - …
```

`### Step N` の数は `stepTitles` の要素数と一致させること。

### 概念（`content/concepts/<id>.md`）

```markdown
---
id: hash-table
name: Hash Table
nameJa: ハッシュ表
kind: 構造            # 構造 | アルゴ
problemNumbers: [1, 146]   # 問題への双方向リンク
complexity:
  - { op: 探索, avg: O(1), worst: O(n) }
studyNote: "学習メモ（任意・インライン $...$ 可）"
---
本文 = 概要（インライン $...$ 可）
```

双方向リンク: 問題の `conceptIds` と概念の `problemNumbers` を相互に一致させる。

## プロジェクト構成

```
app/        ルート（/, /problems/[number], /concepts, /concepts/[id], /api/chat）
components/ layout / library / detail / search / markdown / theme
content/    problems/*.md, concepts/*.md（コンテンツの正典）
lib/        parse-steps, problems, concepts, links, search-index, highlight, types, difficulty
styles/     globals.css, tokens.css（デザイントークン）
```

## テーマ

デザイントークンは `styles/tokens.css` に CSS 変数で定義し、`:root`（ライト）/ `.dark`（ダーク）で切替。
トップバー右のトグルで切り替わり、選択は localStorage に保存される。

## 将来の拡張（未実装）

LLM チャット機能（ストリーミング応答）用に `app/api/chat/route.ts` を 501 スタブとして予約済み。
実装時は Vercel AI SDK (`ai`) + `useChat` を追加し、無料 API（Groq / Gemini / OpenRouter 等）を差し替える。
API キーはサーバー専用 `.env`。なお現状 `next.config.ts` は `output: "export"`（静的書き出し）のため、
チャットの実 API を有効化する際は `output: "export"` を外してサーバーランタイムを有効にする。

## ドキュメント

- 設計: `docs/superpowers/specs/2026-06-28-leetcode-notes-viewer-design.md`
- 実装プラン: `docs/superpowers/plans/2026-06-28-leetcode-notes-viewer.md`
- 開発ガイド: `CLAUDE.md`
