---
id: hash-table
name: Hash Table
nameJa: ハッシュ表
kind: 構造
mastery: 復習中
masteryPct: 65
problemNumbers: [1, 146]
complexity:
  - { op: 探索, avg: O(1), worst: O(n) }
  - { op: 挿入, avg: O(1), worst: O(n) }
  - { op: 削除, avg: O(1), worst: O(n) }
---
キーをハッシュ関数で整数に変換し、配列の添字として使うデータ構造。平均 $O(1)$ でキーの探索・挿入・削除を行える。衝突（異なるキーが同じハッシュ値を持つ場合）はチェイン法やオープンアドレス法で解決する。最悪 $O(n)$ は全要素が同一バケットに衝突したとき。Python の `dict` と `set` はハッシュ表で実装されている。
