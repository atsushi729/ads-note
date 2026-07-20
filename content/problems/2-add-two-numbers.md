---
number: 2
title: Add Two Numbers
source: https://leetcode.com/problems/add-two-numbers/
created: 2026-07-20
difficulty: Medium
solved: true
tags: [Linked List, Math]
conceptIds: []
stepTitles:
  [
    両ノードを個別ループで加算（冗長）,
    重複処理を排除したバージョン,
    再帰版で実装,
  ]
---

# 2. Add Two Numbers

- Difficulty: Medium

## Question

You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

**Example 1:**

![](https://assets.leetcode.com/uploads/2020/10/02/addtwonumber1.jpg)

```
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.
```

**Example 2:**

```
Input: l1 = [0], l2 = [0]
Output: [0]
```

**Example 3:**

```
Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
Output: [8,9,9,9,0,0,0,1]
```

**Constraints:**

- The number of nodes in each linked list is in the range `[1, 100]`.
- `0 <= Node.val <= 9`
- It is guaranteed that the list represents a number that does not have leading zeros.

## Approach

### Step 1

#### 思考

- 両方のNodeの値を計算した合計値のlinked listを作成する
- whileでどちらかのノードがNoneになるまで処理を続ける
- 両方のNodeの値を取り出し、計算しNodeを作成し追加
- 作ったノードを追加した。

#### 実装

```python
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        cur_l1, cur_l2 = l1, l2
        new_node = ListNode()
        carry = 0
        dummy = ListNode()
        dummy.next = new_node

        while cur_l1 and cur_l2:
            val_l1 = cur_l1.val
            val_l2 = cur_l2.val

            total = val_l1 + val_l2 + carry
            carry, val = divmod(total, 10)

            sum_node = ListNode(val)
            new_node.next = sum_node
            new_node = new_node.next
            cur_l1 = cur_l1.next
            cur_l2 = cur_l2.next

        if cur_l1:
            while cur_l1:
                val_l1 = cur_l1.val
                total = val_l1 + carry
                carry, val = divmod(total, 10)
                sum_node = ListNode(val)
                new_node.next = sum_node
                new_node = new_node.next
                cur_l1 = cur_l1.next

        if cur_l2:
            while cur_l2:
                val_l2 = cur_l2.val
                total = val_l2 + carry
                carry, val = divmod(total, 10)
                sum_node = ListNode(val)
                new_node.next = sum_node
                new_node = new_node.next
                cur_l2 = cur_l2.next

        if carry:
            carry_node = ListNode(carry)
            new_node.next = carry_node
            new_node = new_node.next

        return dummy.next.next
```

#### 注意点

- コードが冗長
- 値を取得、加算、持ち越しの処理が重複している。
- 値が存在しない場合のケースを対応して、単一関数内で処理をする。

#### パフォーマンス

- Time complexity : $O(max(m, n))$
- Space complexity: $O(max(m, n))$

### Step 2

#### 思考

- 重複処理を排除したバージョン
- 三項演算子を利用することで冗長な分岐は削除可能。ただし、コーディングルールに応じて対応する。

#### 実装

```python
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode()
        cur = dummy
        carry = 0

        while l1 or l2 or carry:
            v1 = l1.val if l1 else 0
            v2 = l2.val if l2 else 0

            carry, digit = divmod(v1 + v2 + carry, 10)
            cur.next = ListNode(digit)

            cur = cur.next
            l1 = l1.next if l1 else None
            l2 = l2.next if l2 else None

        return dummy.next
```

#### パフォーマンス

- Time complexity : $O(max(m, n))$
- Space complexity: $O(max(m, n))$

### Step 3

#### 思考

- 再帰処理で対応

#### 実装

```python
class Solution:
    def add(self, l1: Optional[ListNode], l2: Optional[ListNode], carry: int) -> Optional[ListNode]:
        if not l1 and not l2 and carry == 0:
            return None

        v1 = l1.val if l1 else 0
        v2 = l2.val if l2 else 0

        carry, digit = divmod(v1 + v2 + carry, 10)

        next_node = self.add(
            l1.next if l1 else None,
            l2.next if l2 else None,
            carry
        )

        return ListNode(digit, next_node)

    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        return self.add(l1, l2, 0)
```

#### パフォーマンス

- Time complexity : $O(max(m, n))$
- Space complexity: $O(max(m, n))$
