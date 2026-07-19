---
number: 128
title: Longest Consecutive Sequence
source: https://leetcode.com/problems/longest-consecutive-sequence/description/?envType=study-plan-v2&envId=top-interview-150
created: 2026-07-18
difficulty: Medium
solved: true
tags: [Array, Hash Table]
conceptIds: [hash-table]
stepTitles: [各要素から都度探索（TLE）, 連続列の先頭のみ探索してO(n)に]
---

# Longest Consecutive Sequence

- Difficulty: Medium

## Question

Given an unsorted array of integers `nums`, return _the length of the longest consecutive elements sequence._

You must write an algorithm that runs in `O(n)` time.

**Example 1:**

```
Input: nums = [100,4,200,1,3,2]
Output: 4
Explanation: The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.
```

**Example 2:**

```
Input: nums = [0,3,7,2,5,8,4,6,0,1]
Output: 9
```

**Example 3:**

```
Input: nums = [1,0,1,2]
Output: 3
```

**Constraints:**

- `0 <= nums.length <= 10<sup>5</sup>`
- `-10<sup>9</sup> <= nums[i] <= 10<sup>9</sup>`

## Approach

### Step 1

#### 思考

- 連続値の最大を検出する
- numsの各要素に対して、連続する値があるかroopで走査する
- このとき、次の値の検索をO(1)で行う。
- そのため、numsの値をhash mapで管理することで、O(1)での検索を行う。

#### 実装

```python
class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        hash_nums = set(nums)
        max_seq = 0

        for num in nums:
            is_consequtive = True
            cur_seq = 0

            while is_consequtive:
                if num in hash_nums:
                    max_seq = max(max_seq, cur_seq + 1)
                    cur_seq += 1
                    num += 1
                else:
                    is_consequtive = False
        return max_seq
```

#### 注意点

- Time Limit Exceededが発生する
  - すべての `num` から連続列を最後まで探索しているため
  - 計算量は$O(n^2)$になる

#### パフォーマンス

- Time complexity : $O(n^2)$
- Space complexity: $O(n)$

### Step 2

#### 思考

- 連続列の先頭だけ走査の対象とする
  - `hash_nums = {1, 2, 3, 4}`の場合
  - `num - 1` を確認
    - 走査する→`num = 1` の場合、`0` は存在しないため、`1` は連続列の先頭
    - 走査なし→`num = 3` の場合、`2` が存在するため、`3` は連続列の途中
- 走査対象データもnumsではなく、重複排除したhash_numsが望ましい
  - 重複したデータは同じ結果を返すため、効率が悪い。

#### 実装

```python
class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        hash_nums = set(nums)
        max_seq = 0

        for num in hash_nums:
            if num - 1 not in hash_nums:
                length = 1
                while num + length in hash_nums:
                    length += 1
                max_seq = max(max_seq, length)
        return max_seq
```

#### 注意点

- 存在を確認する。
- 存在したら、連続しているかwhileで確認する
- Time Limit Exceededにならないように、途中データは調査対象外にする（num - 1）

#### パフォーマンス

- Time complexity : $O(n)$
- Space complexity: $O(n)$
