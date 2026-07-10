---
number: 167
title: Two Sum II - Input Array Is Sorted
source: https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/
created: 2026-07-02
difficulty: Medium
solved: true
tags: [Array, Two Pointers, Binary Search]
conceptIds: [two-pointers, hash-table]
stepTitles: [Two Pointer, 二分探索, ハッシュマップ]
---
# Two Sum II - Input Array Is Sorted
- Difficulty: Medium

## Question
1-indexed かつ非減少順にソート済みの整数配列 `numbers` と整数 `target` が与えられる。和が `target` になる2つの数 `numbers[index1]`、`numbers[index2]`（`1 <= index1 < index2 <= numbers.length`）を見つけ、それぞれの添字（1-indexed）を `[index1, index2]` として返す。同じ要素を2回使うことはできない。解は必ずちょうど1つ存在する。定数空間のみで解くこと。

**Example 1:**
```
Input: numbers = [2,7,11,15], target = 9
Output: [1,2]
```

**Example 2:**
```
Input: numbers = [2,3,4], target = 6
Output: [1,3]
```

**Example 3:**
```
Input: numbers = [-1,0], target = -1
Output: [1,2]
```

**Constraints:**
 - $2 \leq \text{numbers.length} \leq 3 \times 10^4$
 - $-1000 \leq \text{numbers[i]} \leq 1000$
 - `numbers` は非減少順にソート済み
 - $-1000 \leq \text{target} \leq 1000$
 - 解は必ずちょうど1つ存在する

## Approach
### Step 1
#### 思考
 - 逆側から攻める two pointer
 - 両端に置いたポインタで走査する
 - 仮の sum を取得
 - sum < target -> l += 1
 - sum > target -> r -= 1
 - sum == target になったら `[l + 1, r + 1]` を返却する
#### 実装
```python
class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        l, r = 0, len(numbers) - 1

        while l < r:
            cur_sum = numbers[l] + numbers[r]
            if cur_sum == target:
                return [l + 1, r + 1]
            if cur_sum < target:
                l += 1
            else:
                r -= 1
        return [l + 1, r + 1]
```
#### パフォーマンス
 - Time complexity : $O(n)$
 - Space complexity: $O(1)$

### Step 2
#### 思考
 - 二分探索
 - for の index に対して、対応する pair を while で探索するため効率が悪い
#### 実装
```python
class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        for i in range(len(numbers)):
            l, r = i + 1, len(numbers) - 1
            tmp = target - numbers[i]
            while l <= r:
                mid = l + (r - l)//2
                if numbers[mid] == tmp:
                    return [i + 1, mid + 1]
                elif numbers[mid] < tmp:
                    l = mid + 1
                else:
                    r = mid - 1
        return []
```
#### パフォーマンス
 - Time complexity : $O(n \log n)$
 - Space complexity: $O(1)$

### Step 3
#### 思考
 - hash map で実装する
#### 実装
```python
class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        mp = defaultdict(int)
        for i in range(len(numbers)):
            tmp = target - numbers[i]
            if mp[tmp]:
                return [mp[tmp], i + 1]
            mp[numbers[i]] = i + 1
        return []
```
#### パフォーマンス
 - Time complexity : $O(n)$
 - Space complexity: $O(n)$
