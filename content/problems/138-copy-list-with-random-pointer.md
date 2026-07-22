---
number: 138
title: Copy List with Random Pointer
source: https://leetcode.com/problems/copy-list-with-random-pointer/description/?envType=study-plan-v2&envId=top-interview-150
created: 2026-07-22
difficulty: Medium
solved: true
tags: [Linked List, Hash Table]
conceptIds: []
stepTitles:
  [
    値をキーにしたマッピング（失敗）,
    ノード自体をキーにして2周で構築,
    再帰版で実装,
  ]
---

# 138. Copy List with Random Pointer

- Difficulty: Medium

## Question

A linked list of length `n` is given such that each node contains an additional random pointer, which could point to any node in the list, or `null`.

Construct a [**deep copy**](https://en.wikipedia.org/wiki/Object_copying#Deep_copy) of the list. The deep copy should consist of exactly `n` **brand new** nodes, where each new node has its value set to the value of its corresponding original node. Both the `next` and `random` pointer of the new nodes should point to new nodes in the copied list such that the pointers in the original list and copied list represent the same list state. **None of the pointers in the new list should point to nodes in the original list**.

For example, if there are two nodes `X` and `Y` in the original list, where `X.random --> Y`, then for the corresponding two nodes `x` and `y` in the copied list, `x.random --> y`.

Return *the head of the copied linked list*.

The linked list is represented in the input/output as a list of `n` nodes. Each node is represented as a pair of `[val, random_index]` where:

- `val`: an integer representing `Node.val`
- `random_index`: the index of the node (range from `0` to `n-1`) that the `random` pointer points to, or `null` if it does not point to any node.

Your code will **only** be given the `head` of the original linked list.

**Example 1:**

![](https://assets.leetcode.com/uploads/2019/12/18/e1.png)

```
Input: head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
Output: [[7,null],[13,0],[11,4],[10,2],[1,0]]
```

**Example 2:**

![](https://assets.leetcode.com/uploads/2019/12/18/e2.png)

```
Input: head = [[1,1],[2,1]]
Output: [[1,1],[2,1]]
```

**Example 3:**

![](https://assets.leetcode.com/uploads/2019/12/18/e3.png)

```
Input: head = [[3,null],[3,0],[3,null]]
Output: [[3,null],[3,0],[3,null]]
```

**Constraints:**

- `0 <= n <= 1000`
- `-10^4 <= Node.val <= 10^4`
- `Node.random` is `null` or is pointing to some node in the linked list.

## Approach

### Step 1

#### 思考

- linked list の deep copy を作成する
- ポインタを含むリストを作成する
- 作成したリストをもとにノードを作成する
- 新規ノードに random のポインターを追加する
- copy 元のポインタとのマッピングがうまくいかない。事前のデータ保持方法を変更する必要がある

#### 実装

```python
class Solution:  
    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':  
        pointer_list = defaultdict(list)  # {key: [next, random]}  
        node_list = []  
        cur = head  
  
        while cur:  
            val = cur.val  
            next_val = cur.next.val if cur.next else None  
            random_val = cur.random.val if cur.random else None  
            pointer_list[val] = [next_val, random_val]  
            cur = cur.next  
  
        for val, next_val, random_val in pointer_list:  
            node = Node(val, next_val, random_val)  
            node_list.append(node)  
  
        for node, val, next_val, random_val in zip(node_list, pointer_list):  
            node.next =
```

#### 注意点

- 異なるノードが同じ `val` を持つ可能性があるため、値ではなく各ノードそのものをキーとして管理する必要がある

#### パフォーマンス

- Time complexity : $O(n)$
- Space complexity: $O(n)$

### Step 2

#### 思考

- キーとして各ノードを利用する
- 1周目ではオリジナルノードとコピーノードの map を作成する
- 2周目ではオリジナルノードのポインタを利用してコピーノードのポインタを更新する
  - 1周目では参照先のノードがまだ存在しないため、ポインタの紐付けができない
  - そのため2周に分けて対応する

#### 実装

```python
class Solution:  
    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':  
        original_to_clone = {None: None}  
  
        current = head  
  
        # 各ノードを複製し、元ノードとの対応を保存する  
        while current:  
            cloned_node = Node(current.val)  
            original_to_clone[current] = cloned_node  
            current = current.next  
  
        current = head  
  
        # 複製したノードの next と random を設定する  
        while current:  
            cloned_node = original_to_clone[current]  
            cloned_node.next = original_to_clone[current.next]  
            cloned_node.random = original_to_clone[current.random]  
            current = current.next  
  
        return original_to_clone[head]
```

#### パフォーマンス

- Time complexity : $O(n)$
- Space complexity: $O(n)$

### Step 3

#### 思考

- 再帰処理でも実装

#### 実装

```python
class Solution:  
    def __init__(self):  
        self.map = {}  
  
    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':  
        if head is None:  
            return None  
        if head in self.map:  
            return self.map[head]  
  
        copy = Node(head.val)  
        self.map[head] = copy  
        copy.next = self.copyRandomList(head.next)  
        copy.random = self.map.get(head.random)  
        return copy
```

#### パフォーマンス

- Time complexity : $O(n)$
- Space complexity: $O(n)$
