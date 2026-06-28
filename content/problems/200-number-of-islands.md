---
number: 200
title: Number of Islands
source: https://leetcode.com/problems/number-of-islands/
created: 2026-05-06
difficulty: Medium
solved: true
tags: [Graph, BFS]
conceptIds: [bfs]
stepTitles: [DFS で塗りつぶし, BFS で塗りつぶし]
---
# Number of Islands
- Difficulty: Medium

## Question
`'1'`（陸地）と `'0'`（水）からなる 2 次元グリッド `grid` が与えられる。島の数を返す。島は水で囲まれた陸地の連結成分。

**Example 1:**
```
Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1
```

**Example 2:**
```
Input: grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3
```

**Constraints:**
 - $1 \leq \text{grid.length}, \text{grid[0].length} \leq 300$
 - `grid[i][j]` は `'0'` か `'1'`

## Approach
### Step 1
#### 思考
 - 未訪問の `'1'` を見つけたらカウントを増やし、DFS で連結する陸地をすべて `'0'` に塗りつぶす
 - グリッドを直接書き換えて訪問済み管理を行う
#### 実装
```python
class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        rows, cols = len(grid), len(grid[0])

        def dfs(r: int, c: int) -> None:
            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
                return
            grid[r][c] = '0'
            dfs(r + 1, c); dfs(r - 1, c)
            dfs(r, c + 1); dfs(r, c - 1)

        count = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == '1':
                    count += 1
                    dfs(r, c)
        return count
```
#### パフォーマンス
 - Time complexity : $O(m \times n)$
 - Space complexity: $O(m \times n)$

### Step 2
#### 思考
 - DFS をキューを使った BFS に置き換える
 - 再帰スタックを使わないので深いグリッドでも安全
#### 実装
```python
from collections import deque

class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        rows, cols = len(grid), len(grid[0])
        count = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == '1':
                    count += 1
                    grid[r][c] = '0'
                    q: deque[tuple[int, int]] = deque([(r, c)])
                    while q:
                        cr, cc = q.popleft()
                        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                            nr, nc = cr + dr, cc + dc
                            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                                grid[nr][nc] = '0'
                                q.append((nr, nc))
        return count
```
#### パフォーマンス
 - Time complexity : $O(m \times n)$
 - Space complexity: $O(\min(m, n))$
