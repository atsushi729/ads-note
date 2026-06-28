---
id: stack
name: Stack
nameJa: スタック
kind: 構造
mastery: 習得
masteryPct: 100
problemNumbers: [20]
complexity:
  - { op: プッシュ, avg: O(1), worst: O(1) }
  - { op: ポップ, avg: O(1), worst: O(1) }
  - { op: 参照, avg: O(1), worst: O(1) }
---
LIFO（後入れ先出し）の線形データ構造。末尾への追加（push）と末尾からの取り出し（pop）のみを行うため、どちらも $O(1)$。括弧の対応付けや関数呼び出しの管理など、直近の状態を記憶したい場面で使う。Python では `list` の `append`／`pop` がそのままスタックとして機能する。
