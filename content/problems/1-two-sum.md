---
number: 1
title: Two Sum
source: https://leetcode.com/problems/two-sum/
created: 2026-05-04
difficulty: Easy
solved: true
tags: [Array, Hash]
conceptIds: [hash-table]
stepTitles: [ブルートフォース, ハッシュで一回走査]
---
# Two Sum
- Difficulty: Easy

## Question
配列 `nums` と整数 `target` が与えられる。和が `target` になる 2 要素の添字を返す。

**Example 1:**
```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
```

**Example 2:**
```
Input: nums = [3,2,4], target = 6
Output: [1,2]
```

**Constraints:**
 - $2 \leq \text{nums.length} \leq 10^4$
 - $-10^9 \leq \text{nums[i]} \leq 10^9$
 - 答えはちょうど 1 つ存在する。

## Approach
### Step 1
#### 思考
 - すべての 2 要素の組を試す
 - $O(n^2)$ だが実装が単純
#### 実装
```python
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]
        return []
```
#### パフォーマンス
 - Time complexity : $O(n^2)$
 - Space complexity: $O(1)$

### Step 2
#### 思考
 - 補数 `target - x` をハッシュ表に記録しながら一回走査
 - 既に記録があれば即返す
#### 実装
```python
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen: dict[int, int] = {}
        for i, x in enumerate(nums):
            if target - x in seen:
                return [seen[target - x], i]
            seen[x] = i
        return []
```
#### パフォーマンス
 - Time complexity : $O(n)$
 - Space complexity: $O(n)$
