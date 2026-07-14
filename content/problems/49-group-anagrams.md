---
number: 49
title: Group Anagrams
source: https://leetcode.com/problems/group-anagrams/description/?envType=study-plan-v2&envId=top-interview-150
created: 2026-07-13
difficulty: Medium
solved: true
tags: [Array, Hash Table, String]
conceptIds: [hash-table]
stepTitles: [辞書によるグルーピング（バグあり）, タプルのリストで修正, defaultdictで簡潔に]
---
# Group Anagrams
- Difficulty: Medium

## Question
Given an array of strings `strs`, group the anagrams together. You can return the answer in **any order**.

**Example 1:**

**Input:** strs = \["eat","tea","tan","ate","nat","bat"\]

**Output:** \[\["bat"\],\["nat","tan"\],\["ate","eat","tea"\]\]

**Explanation:**

- There is no string in strs that can be rearranged to form `"bat"`.
- The strings `"nat"` and `"tan"` are anagrams as they can be rearranged to form each other.
- The strings `"ate"`, `"eat"`, and `"tea"` are anagrams as they can be rearranged to form each other.

**Example 2:**

**Input:** strs = \[""\]

**Output:** \[\[""\]\]

**Example 3:**

**Input:** strs = \["a"\]

**Output:** \[\["a"\]\]

**Constraints:**

- `1 <= strs.length <= 10<sup>4</sup>`
- `0 <= strs[i].length <= 100`
- `strs[i]` consists of lowercase English letters.

## Approach
### Step 1
#### 思考
 - anagramsのlistを作成する。
 - 単語をsortしたものをkeyとして保持する。
 - keyが操作済みmapの中に存在するか確認する。
- 存在する → valueに追加する
- 存在しない → key, valueのペアを追加する
#### 実装
```python
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        sorted_strs = defaultdict(list)  # sorted: original
        anagram_map = {}
        res = []

        for s in strs:
            sorted_strs[s] = "".join(sorted(s))

        for original, sorted_val in sorted_strs.items():
            if sorted_val in anagram_map:
                anagram_map[sorted_val].append(original)
            else:
                anagram_map[sorted_val] = [original]

        for value in anagram_map.values():
            res.append(value)

        return res
```
#### 注意点
 - `sorted_strs` を辞書にしているため、同じ単語（キー）が複数あるとキーが重複して上書きされてしまう。
 - `sorted_strs = { "": "", "": "" }` のように、元の文字列が重複するケースを取りこぼす。
#### パフォーマンス
 - Time complexity : $O()$
 - Space complexity: $O()$

### Step 2
#### 思考
 - Step1の課題（重複するキーの上書き）に対応する。
 - 辞書ではなく `(original, sorted_val)` のタプルのリストで元の文字列を保持することで、重複を取りこぼさないようにする。
#### 実装
```python
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        sorted_strs = []  # [(original, sorted_value)]
        anagram_map = {}
        res = []

        for s in strs:
            sorted_strs.append((s, "".join(sorted(s))))

        for original, sorted_val in sorted_strs:
            if sorted_val in anagram_map:
                anagram_map[sorted_val].append(original)
            else:
                anagram_map[sorted_val] = [original]

        for value in anagram_map.values():
            res.append(value)

        return res
```
#### 注意点
 -
#### パフォーマンス
 - Time complexity : $O(N \times K \log K)$
 - Space complexity: $O(N \times K)$

### Step 3
#### 思考
 -
#### 実装
```python
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        anagram_map = defaultdict(list)

        for s in strs:
            key = "".join(sorted(s))
            anagram_map[key].append(s)

        return list(anagram_map.values())
```
#### 注意点
 -
#### パフォーマンス
- Time complexity : $O(N \times K \log K)$
- Space complexity: $O(N \times K)$
