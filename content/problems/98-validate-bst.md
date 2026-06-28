---
number: 98
title: Validate Binary Search Tree
source: https://leetcode.com/problems/validate-binary-search-tree/
created: 2026-05-09
difficulty: Medium
solved: false
tags: [Tree, BST]
conceptIds: [binary-search-tree]
stepTitles: [上下限を渡す再帰]
---
# Validate Binary Search Tree
- Difficulty: Medium

## Question
二分木の `root` が与えられる。有効な二分探索木（BST）かどうかを返す。有効な BST は次の条件を満たす。

- ノードの左部分木には、そのノードより小さい値のノードのみ含まれる。
- ノードの右部分木には、そのノードより大きい値のノードのみ含まれる。
- 左右の部分木もともに BST でなければならない。

**Example 1:**
```
Input: root = [2,1,3]
Output: true
```

**Example 2:**
```
Input: root = [5,1,4,null,null,3,6]
Output: false
Explanation: ルートは 5 だが、右の子が 4 < 5 なので BST ではない。
```

**Constraints:**
 - 木のノード数は $[1, 10^4]$ の範囲
 - $-2^{31} \leq \text{Node.val} \leq 2^{31} - 1$

## Approach
### Step 1
#### 思考
 - 各ノードに許容される値の上下限 `(lo, hi)` を引数として渡す再帰
 - ルートでは制限なし（$-\infty$ から $+\infty$）
 - 左に進むと上限が現ノード値に更新、右に進むと下限が更新される
#### 実装
```python
from typing import Optional
import math

class TreeNode:
    def __init__(self, val: int = 0, left: 'Optional[TreeNode]' = None, right: 'Optional[TreeNode]' = None):
        self.val = val; self.left = left; self.right = right

class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        def validate(node: Optional[TreeNode], lo: float, hi: float) -> bool:
            if node is None:
                return True
            if not (lo < node.val < hi):
                return False
            return (validate(node.left, lo, node.val) and
                    validate(node.right, node.val, hi))
        return validate(root, -math.inf, math.inf)
```
#### パフォーマンス
 - Time complexity : $O(n)$
 - Space complexity: $O(h)$
