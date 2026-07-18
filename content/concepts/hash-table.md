---
id: hash-table
name: Hash Table
nameJa: ハッシュ表
kind: 構造
problemNumbers: [1, 146, 167, 202]
complexity:
  - { op: 探索, avg: O(1), worst: O(n) }
  - { op: 挿入, avg: O(1), worst: O(n) }
  - { op: 削除, avg: O(1), worst: O(n) }
studyNote: "Two Sum 系問題の鍵は「残りの値が既に辞書にあるか $O(1)$ で確認する」発想。最悪 $O(n)$ の衝突は競技では無視してよい。"
---
キーをハッシュ関数で整数に変換し、配列の添字として使うデータ構造。平均 $O(1)$ でキーの探索・挿入・削除を行える。衝突（異なるキーが同じハッシュ値を持つ場合）はチェイン法やオープンアドレス法で解決する。最悪 $O(n)$ は全要素が同一バケットに衝突したとき。Python の `dict` と `set` はハッシュ表で実装されている。
