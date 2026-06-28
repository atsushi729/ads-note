# 設計: LeetCode Notes Viewer (algo notes)

- 日付: 2026-06-28
- ステータス: 承認済み（実装プラン作成へ）
- 出典: `design_handoff_leetcode_notes_viewer/README.md` + `screenshots/`

## 1. 目的とスコープ

自作の LeetCode 解答ノート（Markdown）と、学習したデータ構造・アルゴリズムの「概念ノート」を
快適に閲覧・管理する Web アプリ。問題ノートと概念ノートが双方向にリンクし、習得度・統計を可視化する。

### スコープ（今回）
- 6 画面すべて: 問題ライブラリ / 問題詳細 / ⌘K コマンドパレット / 概念ライブラリ / 概念詳細 / モバイル対応
- ライト / ダークの**テーマ切替**（両テーマ実装）
- 双方向リンク（Problem ↔ Concept）

### スコープ外（今回作らない、ただし構造で受け入れる）
- LLM チャット機能（将来）。Vercel AI SDK + 無料 LLM API（Groq / Gemini 等）でストリーミング応答を後付けする前提で、
  サーバールートの「置き場所」だけ予約する。

## 2. 技術スタック

| 領域 | 採用 | 理由 |
|---|---|---|
| フレームワーク | Next.js (App Router) + TypeScript、SSG 出力 | README 推奨。コンテンツ静的化 + 将来のチャット用サーバールートを両立 |
| スタイル | Tailwind CSS（トークンを CSS 変数化） | light/dark の切替を `:root` / `.dark` で実現 |
| Markdown | `gray-matter` + `react-markdown` + `remark-gfm` + `remark-math` + `rehype-katex` | フロントマター分離 + 構造化本文 + LaTeX |
| コードハイライト | `rehype-pretty-code`（shiki）、`github-light` / `github-dark` | README のコード配色に一致 |
| 数式 | `katex`（CSS 同梱） | 制約・計算量の LaTeX |
| アイコン | `lucide-react` | README が字形/絵文字の置換を推奨 |
| フォント | `next/font/google`（Hanken Grotesk, JetBrains Mono） | README 指定 |
| テスト | Vitest + React Testing Library | パーサ・リンク解決・コンポーネントのユニット |
| 将来のチャット | `ai`（Vercel AI SDK） | 今回は依存に入れない。配線可能な構造のみ用意 |

## 3. プロジェクト構造

アプリはリポジトリルート（`/Users/atsushihatakeyama/Desktop/ads-note`）に構築する。
`design_handoff_leetcode_notes_viewer/` は参照資料として残す。

```
app/
  layout.tsx                 # フォント, ThemeProvider, PaletteProvider, グローバルCSS
  page.tsx                   # 問題ライブラリ (/)
  problems/[number]/page.tsx # 問題詳細
  concepts/page.tsx          # 概念ライブラリ
  concepts/[id]/page.tsx     # 概念詳細
  api/chat/route.ts          # 将来用スタブ（501 を返す）。AI SDK 追加で実装
components/
  layout/   TopBar, StatStrip, Sidebar, BottomTabBar, ThemeToggle, SegmentSwitch
  library/  ProblemCard, ConceptCard, FilterPanel
  detail/   TocRail, StepBlock, ExampleBlock, ComplexityChip, ComplexityTable, RelatedProblems, ConceptChips
  search/   CommandPalette  (⌘K)
  markdown/ Markdown.tsx     # react-markdown 共通設定（remark/rehype プラグイン束）
content/
  problems/*.md              # 1問題=1md（701.md に準拠）
  concepts/*.md              # 概念（frontmatter + 学習メモ本文）
lib/
  problems.ts                # build時: glob→gray-matter→parseProblem()
  concepts.ts                # build時: glob→gray-matter→Concept[]
  parse-steps.ts             # 本文を Question / Step[] へ構造化
  links.ts                   # Problem↔Concept 双方向リンク解決
  search-index.ts            # ⌘K 用の軽量インデックス生成
  types.ts                   # Problem, Step, Concept
styles/
  globals.css, tokens.css
```

## 4. データモデル

```ts
type Difficulty = 'Easy' | 'Medium' | 'Hard';
type Mastery = '習得' | '復習中' | '未学習';
type Kind = '構造' | 'アルゴ';

interface Step {
  index: number;
  title: string;
  thinking: string;      // markdown chunk（箇条書き）
  codeLang: string;      // 例: 'python'
  code: string;
  timeComplexity: string;  // 例: 'O(h)'（KaTeX 表示）
  spaceComplexity: string; // 例: 'O(1)'
  note?: string;         // markdown chunk（注意点）
}

interface Problem {
  number: number;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  source: string;
  created: string;
  solved: boolean;
  description?: string;
  question: string;      // ## Question の markdown chunk
  steps: Step[];         // ## Approach の各 Step
  conceptIds: string[];
}

interface ConceptComplexityRow { op: string; avg: string; worst: string; }

interface Concept {
  id: string;
  name: string;          // 英名
  nameJa: string;        // 和名
  kind: Kind;
  mastery: Mastery;
  masteryPct: number;
  note: string;          // 学習メモ（markdown chunk）
  problemNumbers: number[];
  complexity: ConceptComplexityRow[];
}
```

## 5. コンテンツパイプライン（最重要）

ビルド時のみ Node 側で実行（クライアントへはパース済みデータを JSON で渡す）。

### 問題のパース（`parse-steps.ts`）
1. `gray-matter` でフロントマター（title/source/created/description/tags）を分離。
2. 本文を見出しで分割:
   - `## Question` → `question`（markdown chunk として保持）
   - `## Approach` → `### Step N` ごとに分割
3. 各 Step を `#### 思考 / #### 実装 / #### パフォーマンス / #### 注意点` に再分割:
   - 思考・注意点 → markdown chunk
   - 実装 → コードブロックから `code` と `codeLang` を抽出
   - パフォーマンス → `Time complexity : $O(h)$` / `Space complexity: $O(1)$` を正規表現で抽出し
     `timeComplexity` / `spaceComplexity` に格納（チップ表示用）
4. `difficulty` は本文の `- Difficulty:` 行から取得（無ければ Medium）。`solved` はダミーデータで指定。

### 概念のパース（`concepts.ts`）
- frontmatter: `id, name, nameJa, kind, mastery, masteryPct, problemNumbers, complexity(行配列)`
- 本文 = 学習メモ（`note`、インライン LaTeX 可）

### 双方向リンク（`links.ts`）
- `Problem.conceptIds` ↔ `Concept.problemNumbers` をビルド時に突き合わせて整合を取る。
- 概念詳細の「関連する問題」と、問題詳細の「使用した概念」を相互生成。

### 表示時のレンダリング
- markdown chunk（question / thinking / note）は `components/markdown/Markdown.tsx` で統一レンダリング
  （remark-gfm + remark-math + rehype-katex + rehype-pretty-code）。
- 各 chunk 単位でレンダするので、インライン LaTeX・コードハイライトがチャンク内で有効。

## 6. ルーティング / レンダリング / 状態管理

静的コンテンツは Server Component、インタラクションのみ Client Component（islands）。

| 状態 | 置き場所 |
|---|---|
| `theme`（light/dark）| ThemeProvider。localStorage 永続 + `<html class="dark">` トグル。FOUC 防止のインラインスクリプト |
| `filters`（difficulty/tags[]/kind/mastery/query）| ライブラリページの Client 状態。URL searchParams にも反映（共有可能） |
| `paletteOpen / paletteQuery / paletteIndex` | layout 直下の Client Provider。⌘K(mac)/Ctrl+K(win) で開く、Esc / 暗幕クリックで閉じる |
| `expandedSteps: Set<number>` | 問題詳細ページのローカル状態。複数同時開閉可。height/opacity を ~180ms ease |
| `view`（問題/概念）| ルーティングで表現（`/` と `/concepts`）+ SegmentSwitch |

⌘K: `search-index.ts` がビルド時に軽量インデックス（number/title/tags + 本文スニペット）を生成。
クライアントで増分フィルタ。↑↓ で選択、↵ で遷移、本文一致は一致語をオレンジでハイライト。

## 7. テーマ / デザイントークン

- README の数値を `styles/tokens.css` に CSS 変数で定義。`:root`（ライト）/ `.dark`（ダーク）で値を切替。
- Tailwind の `theme.extend` でこれら変数を参照（色・角丸・影・余白・タイポスケール）。
- 主要トークン:
  - Accent: `#fb923c`（深め `#bc4c00`）
  - 難易度 / 習得度: README の light/dark 値
  - 角丸: カード16 / 内側13 / ブロック10-11 / チップ・ボタン6-10
  - 影: README の light/dark 値
  - タイポ: タイトル 800/30px(-.025em)、見出し 700/18px、カードタイトル 600/15px、本文 400/15px(lh 1.65)、メタ 500-600/11-13px モノ
- スクリーンショット（01/02/03/04/05/06/07/08/09/10）をピクセルターゲットに目視照合。

## 8. 画面別コンポーネント要点

- **問題ライブラリ**: TopBar(64px) / StatStrip(4分割: 解いた問題・難易度バー・今週・連続記録) / Sidebar(196px: 難易度+タグ) + カードグリッド `repeat(2,1fr)` gap14 padding20。ProblemCard は #番号・解答状況・タイトル・難易度バッジ・タグ・フッタ(アプローチ数/更新)。hover で境界前景化+影。
- **問題詳細**: TocRail(218px) + 本文(padding 30/38, max-width760)。メタ行 / タイトル(800/30) / Question(段落+インラインコード+Exampleブロック+制約LaTeX) / Step ブロック（展開: 思考・実装(ハイライト)・計算量チップ / 折りたたみ: ヘッダのみ `O(h)·O(1)`）。
- **⌘K パレット**: 暗幕(rgba(6,6,8,.62)+blur) + 上88px・幅560px パネル。入力行 / 「問題」グループ / 「本文中に一致」グループ。
- **概念ライブラリ**: 問題ライブラリ同型 + TopBar に 問題/概念 セグメント切替。統計 `32概念/習得18/復習中9/未学習5`。ConceptCard は 英名・和名・種別チップ・習得度ラベル・問題数・習得度バー。
- **概念詳細**: TocRail + メタ(種別/習得/関連数) / タイトル(英)+和名 / 概要 / 計算量テーブル(操作・平均・最悪, KaTeX) / 関連する問題リスト(双方向) / 学習メモ(左3pxオレンジ境界)。
- **モバイル(375×812)**: 〜768px でサイドバー/TOC をドロワー化、グリッド1カラム、下部タブバー(ライブラリ/検索/統計)。問題詳細・概念詳細の縮約版。

## 9. 将来のチャット用シーム（今回は未実装）

- `app/api/chat/route.ts` を予約し、今回は `501 Not Implemented` を返すスタブ。
- 後日: `ai` SDK を追加し Route Handler で `streamText` → クライアントは `useChat` でストリーミング表示。
- プロバイダは無料 API（Groq 高速・推奨 / Gemini 無料枠 / OpenRouter 無料モデル）を差し替え。
- API キーはサーバー専用 `.env`（クライアントに晒さない）。

## 10. テスト方針

- `parse-steps.ts`: `701. Insert into a Binary Search Tree.md` を入力に、Step 数 (3)・各 Step のコード言語・
  計算量抽出（`O(h)` / `O(1)`）・Question 分離を検証（最重要）。
- `links.ts`: 双方向リンク解決の整合。
- `search-index.ts`: インデックス生成のスモーク。
- 主要コンポーネント（ProblemCard, StepBlock, CommandPalette, ConceptCard, ComplexityTable）のレンダリングスモーク。
- 視覚再現はスクショと目視照合（E2E/Playwright は今回スコープ外）。

## 11. ダミーデータ

サンプルは 701 のみ。スクリーンショットに合わせて補完する。

- 問題: #701, #1 (Two Sum), #200 (Number of Islands), #20 (Valid Parentheses), #146 (LRU Cache),
  #322 (Coin Change), #98 (Validate BST), #700 (Search in a BST) など。
- 概念: Binary Search Tree, Stack, Hash Table, Dynamic Programming, BFS, Two Pointers など（計算量テーブル・習得度付き）。
- 統計値（127/142、連続12日など）はダミーデータから集計、または固定表示。

## 12. 未決事項 / 既定値

- 概念データ形式: **Markdown（frontmatter + 本文）で統一**（オーサリング一貫性のため）。承認済み。
- ⌘K 本文検索の精度: まずは単純な部分一致 + スニペット。全文検索ライブラリ（Fuse 等）は必要なら後で。
```
