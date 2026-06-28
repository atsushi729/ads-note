---
title: Insert into a Binary Search Tree
source: https://leetcode.com/problems/insert-into-a-binary-search-tree/description/
author:
created: 2026-05-04
description: "Can you solve this real interview question? Insert into a Binary Search Tree - You are given the root node of a binary search tree (BST) and a value to insert into the tree. Return the root node of the BST after the insertion. It is guaranteed that the new value does not exist in the original BST.Notice that there may exist multiple valid ways for the insertion, as long as the tree remains a BST after insertion. You can return any of them. Example 1:[https://assets.leetcode.com/uploads/2020/10/05/insertbst.jpg]Input: root = [4,2,7,1,3], val = 5Output: [4,2,7,1,3,5]Explanation: Another accepted tree is:[https://assets.leetcode.com/uploads/2020/10/05/bst.jpg]Example 2:Input: root = [40,20,60,10,30,50,70], val = 25Output: [40,20,60,10,30,50,70,null,null,25]Example 3:Input: root = [4,2,7,1,3,null,null,null,null,null,null], val = 5Output: [4,2,7,1,3,5] Constraints: * The number of nodes in the tree will be in the range [0, 104]. * -108 <= Node.val <= 108 * All the values Node.val are unique. * -108 <= val <= 108 * It's guaranteed that val does not exist in the original BST."
tags:
  - Graph
  - leetcode
---
# Insert into a Binary Search Tree
- URL: https://leetcode.com/problems/insert-into-a-binary-search-tree/description/
- Difficulty: Medium

## Question
You are given the `root` node of a binary search tree (BST) and a `value` to insert into the tree. Return *the root node of the BST after the insertion*. It is **guaranteed** that the new value does not exist in the original BST.

**Notice** that there may exist multiple valid ways for the insertion, as long as the tree remains a BST after insertion. You can return **any of them**.

**Example 1:**

![](https://assets.leetcode.com/uploads/2020/10/05/insertbst.jpg)
```
Input: root = [4,2,7,1,3], val = 5
Output: [4,2,7,1,3,5]
Explanation: Another accepted tree is:
```

**Example 2:**

```
Input: root = [40,20,60,10,30,50,70], val = 25
Output: [40,20,60,10,30,50,70,null,null,25]
```

**Example 3:**

```
Input: root = [4,2,7,1,3,null,null,null,null,null,null], val = 5
Output: [4,2,7,1,3,5]
```

**Constraints:**

 - The number of nodes in the tree will be in the range $[0, 10^4]$.  
 - $-10^8 \leq \text{Node.val} \leq 10^8$  
 - All the values $\text{Node.val}$ are unique. $-10^8 \leq \text{val} \leq 10^8$  
 - It is guaranteed that $\text{val}$ does not exist in the original BST.  

## Approach 
### Step 1
---
#### 思考
 - BSTが前提
 - nodeとvalを比較する
	 - valの方が大きければ、nodeをrightに
	 - valの方が小さければ、nodeをleftに
	 - Noneになればappendして、rootを返す
#### 実装
```python
class Solution:  
    def insert_into_bst(self, root: Optional[TreeNode], val: int) -> Optional[TreeNode]:  
        if not root:  
            return TreeNode(val)  
  
        node = root  
  
        while node:  
            if node.val > val:  
                if not node.left:  
                    node.left = TreeNode(val)  
                    break  
                node = node.left  
            else:  
                if not node.right:  
                    node.right = TreeNode(val)  
                    break  
                node = node.right  
        return root
```
#### パフォーマンス
 - Time complexity : $O(h)$
 - Space complexity: $O(1)$

### Step 2
---
#### 思考
 - コードを見やすく変形する
	 - 条件式の見直し
		 - `not root` より`root is None`の方が明示的
		 - `TreeNode`の真偽値ではなく、`None`かどうかを判定してることが明示的になる
	 - 処理の終了タイミング
		 - `break`するよりも、挿入したタイミングで`return root`した方が処理の終了条件が明確
#### 実装
```python
class Solution:
    def insert_into_bst(self, root: Optional[TreeNode], val: int) -> Optional[TreeNode]:
        if root is None:
            return TreeNode(val)

        node = root

        while True:
            if val < node.val:
                if node.left is None:
                    node.left = TreeNode(val)
                    return root
                node = node.left
            else:
                if node.right is None:
                    node.right = TreeNode(val)
                    return root
                node = node.right
```
#### パフォーマンス
 - Time complexity : $O(h)$
 - Space complexity: $O(1)$

### Step 3
---
#### 思考
 - 別のアプローチを行う。
 - 再帰版で実装する
#### 実装
```python
class Solution:
    def insert_into_bst(self, root: Optional[TreeNode], val: int) -> Optional[TreeNode]:
        if root is None:
            return TreeNode(val)

        if val < root.val:
            root.left = self.insert_into_bst(root.left, val)
        else:
            root.right = self.insert_into_bst(root.right, val)

        return root
```
#### 注意点
 - 再帰深度エラーになる可能性があるため、反復版の方が安全
	 - 1000がデフォルト（[`sys.getrecursionlimit()`](https://docs.python.org/3.14/library/sys.html#sys.getrecursionlimit)）
#### パフォーマンス
 - Time complexity : $O(h)$
 - Space complexity: $O(1)$
