---
number: 322
title: Coin Change
source: https://leetcode.com/problems/coin-change/
created: 2026-05-08
difficulty: Medium
solved: false
tags: [DP]
conceptIds: [dynamic-programming]
stepTitles: [トップダウン, ボトムアップ DP]
---
# Coin Change
- Difficulty: Medium

## Question
コイン額面の配列 `coins` と整数 `amount` が与えられる。`amount` を作るために必要な最小枚数を返す。作れない場合は `-1` を返す。コインは無限に使える。

**Example 1:**
```
Input: coins = [1,5,10], amount = 11
Output: 2
```

**Example 2:**
```
Input: coins = [2], amount = 3
Output: -1
```

**Constraints:**
 - $1 \leq \text{coins.length} \leq 12$
 - $1 \leq \text{coins[i]} \leq 2^{31} - 1$
 - $0 \leq \text{amount} \leq 10^4$

## Approach
### Step 1
#### 思考
 - メモ化再帰（トップダウン DP）
 - `dp(n)` = 残額 `n` を作る最小枚数
 - 各コインで `dp(n - coin)` を試して最小を取る
#### 実装
```python
from functools import lru_cache

class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        @lru_cache(maxsize=None)
        def dp(n: int) -> int:
            if n == 0:
                return 0
            if n < 0:
                return float('inf')  # type: ignore
            return min(dp(n - c) + 1 for c in coins)

        result = dp(amount)
        return result if result != float('inf') else -1
```
#### パフォーマンス
 - Time complexity : $O(\text{amount} \times \text{len(coins)})$
 - Space complexity: $O(\text{amount})$

### Step 2
#### 思考
 - ボトムアップ DP でテーブルを埋める
 - `dp[i]` = 金額 `i` を作る最小枚数、初期値 `amount + 1`（無限大の代わり）
 - 各金額について全コインを試す
#### 実装
```python
class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        INF = amount + 1
        dp = [INF] * (amount + 1)
        dp[0] = 0
        for i in range(1, amount + 1):
            for c in coins:
                if c <= i:
                    dp[i] = min(dp[i], dp[i - c] + 1)
        return dp[amount] if dp[amount] != INF else -1
```
#### パフォーマンス
 - Time complexity : $O(\text{amount} \times \text{len(coins)})$
 - Space complexity: $O(\text{amount})$
