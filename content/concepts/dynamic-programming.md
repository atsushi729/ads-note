---
id: dynamic-programming
name: Dynamic Programming
nameJa: 動的計画法
kind: アルゴ
mastery: 復習中
masteryPct: 55
problemNumbers: [322]
complexity:
  - { op: 一般（状態数×遷移数）, avg: O(n \cdot k), worst: O(n \cdot k) }
---
重複する部分問題を一度だけ解いて結果をメモすることで、指数時間の全探索を多項式時間に削減する手法。トップダウン（メモ化再帰）とボトムアップ（テーブル充填）の 2 形式がある。適用可能条件は「最適部分構造」と「重複部分問題」の 2 つ。コイン問題では $dp[i]$ を金額 $i$ を作る最小枚数として定義し、$dp[i] = \min_{c \in \text{coins}} dp[i-c] + 1$ で遷移する。
