---
number: 700
title: Search in a Binary Search Tree
source: https://leetcode.com/problems/search-in-a-binary-search-tree/
created: 2026-05-10
difficulty: Easy
solved: true
tags: [Tree, BST]
conceptIds: [binary-search-tree]
stepTitles: [反復探索]
---
# Search in a Binary Search Tree
- Difficulty: Easy

## Question
BST の `root` と整数 `val` が与えられる。値が `val` に等しいノードを根とする部分木を返す。存在しなければ `null` を返す。

**Example 1:**
```
Input: root = [4,2,7,1,3], val = 2
Output: [2,1,3]
```

**Example 2:**
```
Input: root = [4,2,7,1,3], val = 5
Output: []
```

**Constraints:**
 - 木のノード数は $[1, 5000]$ の範囲
 - $1 \leq \text{Node.val} \leq 10^7$
 - `root` は有効な BST
 - $1 \leq \text{val} \leq 10^7$

## Approach
### Step 1
#### 思考
 - BST の性質を使い、`val` と現ノード値を比較しながら左右に下りる
 - ループで実装すると再帰スタックを使わず安全
#### 実装
```python
from typing import Optional

class TreeNode:
    def __init__(self, val: int = 0, left: 'Optional[TreeNode]' = None, right: 'Optional[TreeNode]' = None):
        self.val = val; self.left = left; self.right = right

class Solution:
    def searchBST(self, root: Optional[TreeNode], val: int) -> Optional[TreeNode]:
        node = root
        while node is not None:
            if val == node.val:
                return node
            elif val < node.val:
                node = node.left
            else:
                node = node.right
        return None
```
#### パフォーマンス
 - Time complexity : $O(h)$
 - Space complexity: $O(1)$
