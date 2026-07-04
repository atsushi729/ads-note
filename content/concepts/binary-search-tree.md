---
id: binary-search-tree
name: Binary Search Tree
nameJa: 二分探索木
kind: 構造
problemNumbers: [701, 700, 98]
complexity:
  - { op: 探索, avg: O(\log n), worst: O(n) }
  - { op: 挿入, avg: O(\log n), worst: O(n) }
  - { op: 削除, avg: O(\log n), worst: O(n) }
studyNote: "挿入は平均 $O(\\log n)$ だが昇順データを順に挿入すると連結リスト状（$O(n)$）に退化する。平衡 BST（AVL・赤黒木）が必要な理由はここにある。"
---
各ノードについて **左部分木の全値 < ノード値 < 右部分木の全値** の順序を保つ二分木。この不変条件により、探索・挿入・削除を木の高さ $h$ に比例する手数で行える。挿入は「$None$ に到達するまで降りて葉として付ける」だけ。最悪 $O(n)$ は偏った木（連結リスト状）のとき。実用では平衡木（AVL / 赤黒木）で高さを保証する。
