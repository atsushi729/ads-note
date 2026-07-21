---
number: 21
title: Merge Two Sorted Lists
source: https://leetcode.com/problems/merge-two-sorted-lists/description/?envType=study-plan-v2&envId=top-interview-150
created: 2026-07-21
difficulty: Easy
solved: true
tags: [Linked List]
conceptIds: []
stepTitles:
  [
    基本実装（whileで走査してsplice）,
    比較演算子と終端処理を整理,
    再帰版で実装,
  ]
---

# 21. Merge Two Sorted Lists

- Difficulty: Easy

## Question

You are given the heads of two sorted linked lists `list1` and `list2`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.

Return *the head of the merged linked list*.

**Example 1:**

![](https://assets.leetcode.com/uploads/2020/10/03/merge_ex1.jpg)

```
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
```

**Example 2:**

```
Input: list1 = [], list2 = []
Output: []
```

**Example 3:**

```
Input: list1 = [], list2 = [0]
Output: [0]
```

**Constraints:**

- The number of nodes in both lists is in the range `[0, 50]`.
- `-100 <= Node.val <= 100`
- Both `list1` and `list2` are sorted in **non-decreasing** order.

## Approach

### Step 1

#### 思考

- 2つのlinked listを確認し、小さい方のものを順に並び替える
- whileで2つのlinked listを走査
- 小さい方のものを取得し、次のリストとして付け足す
- 両方がNoneになるまで続ける
- dummy.nextを返す

#### 実装

```python
class Solution:  
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:  
        dummy = ListNode()  
        cur = dummy  
  
        while list1 and list2:  
            if list1.val < list2.val:  
                cur.next = list1  
                list1 = list1.next  
            else:  
                cur.next = list2  
                list2 = list2.next  
            cur = cur.next  
  
        if list1:  
            cur.next = list1  
        else:  
            cur.next = list2  
  
        return dummy.next
```

#### 注意点

- パフォーマンス自体は最適解
- 可読性自体は改善可能（作ったリストの対応箇所）

#### パフォーマンス

- Time complexity : $O(n + m)$
- Space complexity: $O(1)$

### Step 2

#### 思考

- 作ったリストの対応箇所を改善

#### 実装

```python
class Solution:  
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:  
        dummy = ListNode()  
        cur = dummy  
  
        while list1 and list2:  
            if list1.val <= list2.val:  
                cur.next = list1  
                list1 = list1.next  
            else:  
                cur.next = list2  
                list2 = list2.next  
            cur = cur.next  
  
        cur.next = list1 if list1 else list2  
  
        return dummy.next
```

#### パフォーマンス

- Time complexity : $O(n + m)$
- Space complexity: $O(1)$

### Step 3

#### 思考

- 再帰処理でも実装

#### 実装

```python
class Solution:  
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:  
        if list1 is None:  
            return list2  
        if list2 is None:  
            return list1  
        if list1.val <= list2.val:  
            list1.next = self.mergeTwoLists(list1.next, list2)  
            return list1  
        else:  
            list2.next = self.mergeTwoLists(list1, list2.next)  
            return list2
```

#### パフォーマンス

- Time complexity : $O(n + m)$
- Space complexity: $O(n + m)$
