---
number: 146
title: LRU Cache
source: https://leetcode.com/problems/lru-cache/
created: 2026-05-07
difficulty: Hard
solved: true
tags: [Design]
conceptIds: [hash-table]
stepTitles: [OrderedDict, 双方向連結リスト＋ハッシュ]
---
# LRU Cache
- Difficulty: Hard

## Question
容量 `capacity` の LRU（最近最も使われていない）キャッシュを設計せよ。

- `get(key)`: `key` が存在すれば値を返し、なければ `-1` を返す。
- `put(key, value)`: キーが存在すれば値を更新、なければ挿入する。容量超過時は最も長く使われていないキーを削除する。

どちらの操作も $O(1)$ の平均時間計算量で動かせ。

**Example 1:**
```
Input: ["LRUCache","put","put","get","put","get","put","get","get","get"]
       [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]
Output: [null,null,null,1,null,-1,null,-1,3,4]
```

**Constraints:**
 - $1 \leq \text{capacity} \leq 3000$
 - $0 \leq \text{key} \leq 10^4$
 - $0 \leq \text{value} \leq 10^5$

## Approach
### Step 1
#### 思考
 - Python の `OrderedDict` は挿入順を保持し `move_to_end` で末尾に移動できる
 - 末尾が最近使用、先頭が最古として扱う
#### 実装
```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int) -> None:
        self.cap = capacity
        self.cache: OrderedDict[int, int] = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)
```
#### パフォーマンス
 - Time complexity : $O(1)$
 - Space complexity: $O(\text{capacity})$

### Step 2
#### 思考
 - `OrderedDict` を使わず双方向連結リスト＋ハッシュで実装
 - ダミーの `head`・`tail` ノードで境界処理を簡略化
 - ハッシュは `key → node` の $O(1)$ 参照を担う
#### 実装
```python
class Node:
    def __init__(self, key: int = 0, val: int = 0):
        self.key, self.val = key, val
        self.prev = self.next = None  # type: ignore

class LRUCache:
    def __init__(self, capacity: int) -> None:
        self.cap = capacity
        self.map: dict[int, Node] = {}
        self.head, self.tail = Node(), Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node: Node) -> None:
        node.prev.next = node.next  # type: ignore
        node.next.prev = node.prev  # type: ignore

    def _insert_tail(self, node: Node) -> None:
        node.prev = self.tail.prev
        node.next = self.tail
        self.tail.prev.next = node  # type: ignore
        self.tail.prev = node

    def get(self, key: int) -> int:
        if key not in self.map:
            return -1
        node = self.map[key]
        self._remove(node)
        self._insert_tail(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.map:
            self._remove(self.map[key])
        node = Node(key, value)
        self.map[key] = node
        self._insert_tail(node)
        if len(self.map) > self.cap:
            lru = self.head.next
            self._remove(lru)  # type: ignore
            del self.map[lru.key]  # type: ignore
```
#### パフォーマンス
 - Time complexity : $O(1)$
 - Space complexity: $O(\text{capacity})$
