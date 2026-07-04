---
id: bfs
name: BFS
nameJa: 幅優先探索
kind: アルゴ
problemNumbers: [200]
complexity:
  - { op: 探索（グラフ）, avg: O(V + E), worst: O(V + E) }
  - { op: 探索（グリッド）, avg: O(m \times n), worst: O(m \times n) }
studyNote: "Python の `list.pop(0)` は $O(n)$ なので必ず `collections.deque` の `popleft()` を使う。この一点を意識するだけで TLE を防げる。"
---
キューを使ってグラフや木を幅（距離）順に探索するアルゴリズム。出発ノードから近い順に訪問するため、**最短経路**（辺の重みが等しい場合）を保証できる。グリッドの連結成分（島の数など）を列挙するときも有効。時間計算量は頂点数 $V$ と辺数 $E$ の和 $O(V + E)$。Python では `collections.deque` の `popleft` で $O(1)$ のデキューを実現する。
