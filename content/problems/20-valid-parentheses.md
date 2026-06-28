---
number: 20
title: Valid Parentheses
source: https://leetcode.com/problems/valid-parentheses/
created: 2026-05-05
difficulty: Easy
solved: true
tags: [Stack]
conceptIds: [stack]
stepTitles: [スタックで対応付け]
---
# Valid Parentheses
- Difficulty: Easy

## Question
文字列 `s` は `(`, `)`, `{`, `}`, `[`, `]` のみからなる。入力が有効な括弧列かどうかを返す。

**Example 1:**
```
Input: s = "()"
Output: true
```

**Example 2:**
```
Input: s = "()[]{}"
Output: true
```

**Example 3:**
```
Input: s = "(]"
Output: false
```

**Constraints:**
 - $1 \leq \text{s.length} \leq 10^4$
 - `s` は `()[]{}` のみで構成される

## Approach
### Step 1
#### 思考
 - スタックに開き括弧を積む
 - 閉じ括弧が来たらスタックのトップと対応を確認する
 - 最後にスタックが空なら有効
#### 実装
```python
class Solution:
    def isValid(self, s: str) -> bool:
        stack: list[str] = []
        mapping = {')': '(', '}': '{', ']': '['}
        for ch in s:
            if ch in mapping:
                top = stack.pop() if stack else '#'
                if mapping[ch] != top:
                    return False
            else:
                stack.append(ch)
        return not stack
```
#### パフォーマンス
 - Time complexity : $O(n)$
 - Space complexity: $O(n)$
