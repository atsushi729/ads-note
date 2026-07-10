---
id: two-pointers
name: Two Pointers
nameJa: 二ポインタ
kind: アルゴ
problemNumbers: [167]
complexity:
  - { op: 走査（ソート済み配列）, avg: O(n), worst: O(n) }
studyNote: "ソート済みが前提の手法なので、問題文に sorted の記載がなければ $O(n \\log n)$ のソートコストも含めて計算量を評価する必要がある。"
---
配列やリストの両端（または同方向）に 2 本のポインタを置き、条件に応じて移動させながら目標を探す手法。ソート済み配列の 2 数和（Two Sum II）や回文判定など、$O(n^2)$ の全探索を $O(n)$ に削減できる場面で活躍する。スライディングウィンドウは同方向の二ポインタの一形態。
