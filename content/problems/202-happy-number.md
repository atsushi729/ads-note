---
number: 202
title: Happy Number
source: https://leetcode.com/problems/happy-number/description/?envType=study-plan-v2&envId=top-interview-150
created: 2026-07-15
difficulty: Easy
solved: true
tags: [Hash Table, Math]
conceptIds: [hash-table]
stepTitles: [setでループ検知（未整理）, 不要なコードを整理, 初期値追加とdivmodで簡潔化]
---
# Happy Number
- Difficulty: Easy

## Question
Write an algorithm to determine if a number `n` is happy.

A **happy number** is a number defined by the following process:

- Starting with any positive integer, replace the number by the sum of the squares of its digits.
- Repeat the process until the number equals 1 (where it will stay), or it **loops endlessly in a cycle** which does not include 1.
- Those numbers for which this process **ends in 1** are happy.

Return `true` *if* `n` *is a happy number, and* `false` *if not*.

**Example 1:**

**Input:** n = 19

**Output:** true

**Explanation:**

```
12 + 92 = 82
82 + 22 = 68
62 + 82 = 100
12 + 02 + 02 = 1
```

**Example 2:**

**Input:** n = 2

**Output:** false

**Constraints:**

- `1 <= n <= 2^31 - 1`

## Approach
### Step 1
#### 思考
 - Happy numberのルール通り、各桁の2乗の合計を計算
 - 1がでればTrue、それ以外は探索済みとして、set()に格納。
 - 既に探索済みの値が再度でた場合、ループを検知。Falseにする
#### 実装
```python
class Solution:
    def isHappy(self, n: int) -> bool:
        prev_n = n
        seen = set()

        while True:
            n = self.get_digit(n)
            if n == 1:
                return True
            if n in seen:
                return False
            seen.add(n)
        return False

    def get_digit(self, val):
        res = []

        while val:
            left_over = val % 10
            res.append(left_over ** 2)
            val = val // 10
        return sum(res)
```
#### 注意点
 - prev_nは利用していないので削除
 - return Falseは実行されないので削除
 - 負の値を渡すと無限ループに陥る
 - `get_digit`でリストを作る必要がない
 - `get_digit`という名前が処理内容と一致しにくい
#### パフォーマンス
 - Time complexity : $O(log n)$
 - Space complexity: $O(log n)$

### Step 2
#### 思考
 - step 1の注意点を対応
#### 実装
```python
class Solution:
    def isHappy(self, n: int) -> bool:
        if n <= 0:
            return False

        seen = set()

        while n != 1:
            n = self.get_digit_square_sum(n)

            if n in seen:
                return False

            seen.add(n)

        return True

    def get_digit_square_sum(self, val: int) -> int:
        total = 0

        while val:
            digit = val % 10
            total += digit ** 2
            val //= 10

        return total
```
#### パフォーマンス
 - Time complexity : $O(log n)$
 - Space complexity: $O(log n)$

### Step 3
#### 思考
 - 初期値を先にseenに追加する。
 - `divmod`で処理を簡潔にする
#### 実装
```python
class Solution:
    def isHappy(self, n: int) -> bool:
        if n <= 0:
            return False

        seen = set()

        while n != 1 and n not in seen:
            seen.add(n)
            n = self.get_digit_square_sum(n)

        return n == 1

    def get_digit_square_sum(self, val: int) -> int:
        total = 0

        while val:
            val, digit = divmod(val, 10)
            total += digit * digit

        return total
```
#### 注意点
 -
#### パフォーマンス
 - Time complexity : $O(log n)$
 - Space complexity: $O(log n)$
