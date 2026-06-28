# Handoff: LeetCode Notes Viewer（LeetCode学習ノート閲覧アプリ）

## Overview
自作のLeetCode解答ノート（Markdown）と、学習したデータ構造・アルゴリズムの「概念ノート」を、快適に閲覧・管理するアプリ。問題ノートと概念ノートが**双方向にリンク**し、習得度・統計を可視化する。

主な機能:
- 問題ライブラリ（カード一覧、難易度/タグ/解答状況フィルタ、統計サマリー）
- 問題詳細（目次ジャンプ、本文、制約のLaTeX表示、Step単位の折りたたみ、コードのシンタックスハイライト、計算量表示）
- ⌘K コマンドパレット検索（問題名・タグ・本文横断）
- 概念ライブラリ（データ構造/アルゴリズムを習得度バー付きカードで管理）
- 概念詳細（概要、計算量テーブル、関連問題への双方向リンク、学習メモ）
- モバイル対応

## About the Design Files
このバンドルに含まれる `LeetCode Notes Viewer.dc.html` は **HTMLで作成したデザイン参照（プロトタイプ）** であり、そのまま本番に貼り付けるコードではない。意図した見た目・挙動を示すモックである。

タスクは、このHTMLデザインを**ターゲットのコードベースの既存環境（React / Next.js / Vue / SwiftUI 等）で、その確立されたパターンとライブラリを使って作り直すこと**。まだ環境が無い場合は、本プロジェクトに最適なフレームワークを選んで実装してよい（推奨: Next.js + TypeScript + Tailwind、Markdownは `gray-matter` + `react-markdown` + `remark-math`/`rehype-katex`、コードは `shiki` か `rehype-pretty-code`）。

> 注意: HTMLはパン可能なデザインボード（複数案を並べた1ファイル）になっている。実装では**ライト案かダーク案のどちらか1方向**を選ぶ（あるいはテーマ切替として両方）。下記トークンは両テーマ分を記載。

## Fidelity
**High-fidelity（hifi）**。最終的な配色・タイポgrafィ・余白・角丸・状態まで作り込んだピクセル指向のモック。下記の数値どおりに、コードベース既存のコンポーネントで再現すること。

## Data Model（データモデル）
ノートは1問題=1 Markdownファイル。フロントマター + 本文。実例（`uploads/701. Insert into a Binary Search Tree.md`）に準拠:

```yaml
---
title: Insert into a Binary Search Tree
source: https://leetcode.com/problems/insert-into-a-binary-search-tree/
created: 2026-05-04
description: "..."
tags: [Graph, leetcode]
---
```
本文構造（`##` / `###` / `####` 見出し）:
- `## Question` … 問題文 + Example（```コードブロック```）+ Constraints（`$...$` でLaTeX）
- `## Approach`
  - `### Step 1` / `Step 2` / `Step 3` … 各Stepが折りたたみ単位
    - `#### 思考` … 箇条書き
    - `#### 実装` … ```python コードブロック```
    - `#### パフォーマンス` … Time/Space 計算量（`$O(h)$` など）
    - `#### 注意点`（任意）

推奨エンティティ:
- **Problem**: `{ number, title, difficulty: 'Easy'|'Medium'|'Hard', tags: string[], source, created, solved: boolean, steps: Step[], conceptIds: string[] }`
- **Step**: `{ index, title, thinking: string[], codeLang, code, timeComplexity, spaceComplexity, note? }`
- **Concept**: `{ id, name, nameJa, kind: '構造'|'アルゴ', mastery: '習得'|'復習中'|'未学習', masteryPct: number, note, problemNumbers: number[], complexity: {op,avg,worst}[] }`

Problem.conceptIds と Concept.problemNumbers で双方向リンクを構成する。

## Screens / Views

### 1. 問題ライブラリ（Problem Library）
- **Purpose**: 解答ノートの一覧・検索・フィルタ・進捗確認。
- **Layout**: 縦に [トップバー 64px] / [統計ストリップ 4分割] / [本文: 左サイドバー196px + カードグリッド]。カードグリッドは `repeat(2, 1fr)`、gap 14px、padding 20px。全体は角丸16px・1px境界・薄い影のカード。
- **Components**:
  - トップバー: ロゴ（24px角丸7px、ダーク地にオレンジの `{ }` モノ字形）+ アプリ名 "algo notes"（Hanken Grotesk 700/15px）+ 検索フィールド（max380px、内側に ⌕ と "⌘K" キーキャップ）+「並び替え ▾」+「＋ ノート追加」（プライマリボタン）。
  - 統計ストリップ: 4カラム。①解いた問題 `127 / 142`（数字 800/26px）②難易度（易64/中51/難12 + 横積みバー 高さ6px）③今週 `9 問` ④連続記録 `12 日 🔥`。区切りは1pxグリッド線。
  - サイドバー: 「難易度」(すべて/Easy/Medium/Hard、選択中は薄い塗り角丸8px) + 「タグ」(チップ群)。
  - 問題カード: 上段に `#701`(モノ12px) と 解答状況(`✓ 解答済`/`○ 未着手`) / タイトル(600/15px) / 難易度バッジ + タグチップ / フッタ区切り線の上に `3 アプローチ` と `更新 5/04`。hover: 境界が前景色化＋影。

### 2. 問題詳細（Problem Detail / Reading）
- **Purpose**: 1問題を読む。目次ジャンプ + Step折りたたみ。
- **Layout**: 左TOCレール218px（薄い地色）+ 本文 padding 30px 38px、max-width 760px。
- **Components**:
  - TOCレール: 「← ライブラリ」/「目次」見出し / 問題・制約 / 「アプローチ」見出し / Step 1（アクティブ: 白地＋左2pxオレンジ境界）/ Step 2 / Step 3。
  - メタ行: `#701` + 難易度バッジ + タグ + 右端 `leetcode ↗`。
  - タイトル: Hanken Grotesk 800/30px、letter-spacing -.025em。
  - 本文段落 + インラインコード（モノ、薄地角丸）。
  - Example ブロック: 薄地・1px境界・角丸11px、モノ13px、`Input`(オレンジ)/`Output`(緑) ラベル。
  - 制約: LaTeX（`[0, 10^4]`、`-10^8 ≤ Node.val ≤ 10^8`）を KaTeX でレンダリング。
  - Step 1（展開）: ヘッダ（番号バッジ + タイトル + ▾）/「思考」箇条書き /「実装」コードブロック（シンタックスハイライト）/ 計算量チップ（Time `O(h)` / Space `O(1)`、KaTeX）。
  - Step 2 / 3（折りたたみ）: ヘッダのみ。番号バッジ(グレー) + タイトル + 右に `O(h) · O(1)` + ▸。クリックで展開。

### 3. ⌘K コマンドパレット（Search）
- **Purpose**: 問題名・タグ・本文を横断検索。
- **Layout**: 画面全体に暗幕(rgba(6,6,8,.62)+blur)、上から88pxの位置に幅560pxのパネル（角丸14px、強い影）。
- **Components**: 検索入力行（⌕ + クエリ + 点滅キャレット + `esc`）/ 結果グループ「問題」（選択行はオレンジ薄塗り、`#701` + タイトル + 難易度 + `3 ステップ ↵`）/ グループ「本文中に一致」（一致語をオレンジでハイライト）。

### 4. 概念ライブラリ（Concept Library）
- **Purpose**: データ構造/アルゴリズムを習得度で管理。
- **Layout**: 問題ライブラリと同型。トップバーに **問題/概念 のセグメント切替**（概念がアクティブ）。統計行: `32 概念 / 習得18 / 復習中9 / 未学習5`。サイドバー: 種別(すべて/データ構造/アルゴリズム) + 習得度。カードグリッド `repeat(2,1fr)`。
- **Components**: 概念カード = 英名(600/15px) + 和名(12px グレー) + 種別チップ(構造/アルゴ) / 習得度ラベル(色分け) + `6 問題` / 習得度バー(高さ5px、幅=masteryPct%、色=習得度色)。

### 5. 概念詳細（Concept Detail）
- **Purpose**: 概念を学ぶ。関連問題へ双方向ジャンプ。
- **Layout**: TOCレール218px + 本文。
- **Components**:
  - メタ: 種別チップ + `● 習得`(色分け) + 右端 `関連 6 問題`。
  - タイトル(英) + 和名サブ。
  - 概要段落（強調 + インラインLaTeX `h`）。
  - 計算量テーブル: 3カラム（操作/平均/最悪）、ヘッダ薄地モノ、各セルの計算量は KaTeX（`O(\log n)`, `O(n)`）。
  - 関連する問題リスト: 各行 `#番号` + タイトル + 難易度バッジ + 解答状況。hover強調。クリックで該当問題詳細へ。
  - 学習メモ: 左3pxオレンジ境界の薄地ブロック、自由記述（インラインLaTeX可）。

### 6. モバイル（375 × 812）
- 問題詳細の縮約版。ステータスバー / 戻る+#番号+難易度+目次☰ のヘッダ / スクロール本文（タイトル・タグ・要約・Stepカード）/ 下部タブバー（📚ライブラリ / ⌕検索 / 📊統計、アクティブはオレンジ）。同様に概念詳細もモバイル化する。

## Interactions & Behavior
- カード/行クリック → 詳細へ遷移。戻るリンクで一覧へ。
- Step ヘッダクリック → そのStepを開閉（▸/▾）。複数同時開閉可。アニメは height/opacity を ~180ms ease。
- ⌘K（macOS）/ Ctrl+K（Win）→ パレット起動、Esc/暗幕クリックで閉じる。入力でインクリメンタル絞り込み、↑↓で選択、↵で遷移。
- セグメント切替（問題/概念）→ ライブラリの内容を切替。
- フィルタ（難易度/タグ/種別/習得度）→ 一覧を即時フィルタ。
- hover: カードは境界色をテーマ前景（ライト=#15140f / ダーク=#fb923c）に、影/地色を強調。
- 双方向リンク: 問題詳細に「使用した概念」チップ、概念詳細に「関連する問題」リスト。互いに遷移。
- レスポンシブ: 〜768pxでサイドバー/TOCをドロワー化、グリッドを1カラム、下部タブバー表示。

## State Management
- `view`: 'problems' | 'concepts'
- `selectedProblem` / `selectedConcept`
- `filters`: { difficulty, tags[], kind, mastery, query }
- `paletteOpen`: boolean、`paletteQuery`、`paletteIndex`
- `expandedSteps`: Set<stepIndex>（詳細ごと）
- データ取得: ビルド時に `content/**/*.md` を読み、gray-matterでパース → Problem[] を生成。概念は別データ（JSON or `content/concepts/*.md`）。クライアントは静的JSONを読むだけで可（SSG推奨）。

## Design Tokens

### カラー — 共通
- Accent（オレンジ）: `#fb923c`、深め（ライト文字用）: `#bc4c00`
- 難易度: Easy `#1a7f37`(L)/`#3fb950`(D) ・ Medium `#bc4c00`(L)/`#fb923c`(D) ・ Hard `#cf222e`(L)/`#f85149`(D)
- 習得度: 習得=Easy色 / 復習中=Medium色 / 未学習 `#b3aea4`(L)/`#6a6a70`(D)

### カラー — ライト案（Notion/Stripe系）
- 背景: `#ffffff` / 薄地: `#fcfbf9`, `#f6f5f2` / 区切り: `#f1f0ec`, `#ededea`
- 文字: 主 `#15140f` / 副 `#403d36`, `#6b675e` / 弱 `#a8a39a`, `#b3aea4`
- コードブロック: 地 `#f6f8fa`、境界 `#eceef1`
- コード配色(GitHub風 light): base `#1f2328` / keyword `#cf222e` / def `#8250df` / type `#0550ae` / comment `#6e7781`

### カラー — ダーク案（Vercel/Linear系）
- 背景: `#0b0b0d` / パネル: `#101013`, `#0e0e11`, `#141417` / 区切り: `#18181b`, `#1c1c20`, `#1f1f24`, `#232329`
- 文字: 主 `#ededed`, `#f4f4f5` / 副 `#b6b6bc`, `#c8c8cc` / 弱 `#8a8a90`, `#6a6a70`, `#5a5a60`
- コード配色(GitHub風 dark): base `#c9d1d9` / keyword `#ff7b72` / def `#d2a8ff` / type `#79c0ff` / comment `#8b949e`

### タイポグラフィ
- UI/本文: **Hanken Grotesk**（400/500/600/700/800）
- コード/番号/ラベル: **JetBrains Mono**（400/500/600）
- スケール: タイトル 800/30px(-.025em) ・ 見出し 700/18px ・ カードタイトル 600/15px ・ 本文 400/15px(line-height 1.65) ・ ラベル/メタ 500-600/11-13px(モノ)
- 数式: **KaTeX**（CSS+JS）。`data-tex` 属性をレンダリング（実装では remark-math + rehype-katex）。

### 形状・影
- 角丸: カード16px / 内側カード13px / ブロック10-11px / チップ・ボタン 6-10px
- 影(ライト): `0 1px 3px rgba(0,0,0,.06), 0 12px 40px rgba(0,0,0,.04)`
- 影(ダーク): `0 1px 3px rgba(0,0,0,.4), 0 18px 50px rgba(0,0,0,.35)`
- 余白基準: カード内padding 16-18px / 本文 30px 38px / グリッドgap 14px

## Assets
- フォント: Google Fonts（Hanken Grotesk, JetBrains Mono）
- 数式: KaTeX 0.16.9（CDN: `katex.min.css` / `katex.min.js`）。本番は npm `katex` + `rehype-katex`。
- アイコン: 現状は字形/絵文字（⌕ ▾ ▸ ↵ 🔥 📚 📊）。本番はアイコンライブラリ（lucide等）に置換推奨。
- 画像: なし（LeetCode本文の図は `source` URL参照、必要なら自前ホスト）。

## Screenshots（`screenshots/` 各画面の視覚ターゲット）
- `01-problem-library-light.png` … 問題ライブラリ（ライト）
- `02-problem-detail-light.png` … 問題詳細（ライト、Step1展開）
- `03-problem-library-dark.png` … 問題ライブラリ（ダーク）
- `04-problem-detail-dark.png` … 問題詳細（ダーク）
- `05-mobile-light.png` … モバイル詳細（ライト）
- `06-mobile-dark.png` … モバイル詳細（ダーク）
- `07-concept-library-light.png` … 概念ライブラリ（ライト）
- `08-concept-detail-light.png` … 概念詳細（ライト、計算量テーブル + 関連問題）
- `09-concept-library-dark.png` … 概念ライブラリ（ダーク）
- `10-concept-detail-dark.png` … 概念詳細（ダーク）
> ⌘Kコマンドパレットは `03-problem-library-dark.png` の元デザイン（HTMLボードのB1）で確認できる。各PNGは全体が収まるよう縮小済み。厳密な数値は本READMEを正とすること。

## Files
- `LeetCode Notes Viewer.dc.html` … 全画面のデザイン参照（パン可能ボード。A=ライト案 / B=ダーク案 / モバイル / C=概念ライブラリ&詳細）。ブラウザで直接開ける。
- `701. Insert into a Binary Search Tree.md` … 入力Markdownの実例（データ構造の正準）。
- `screenshots/*.png` … 各画面のレンダリング結果。
