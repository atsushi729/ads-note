---
number: 290
title: Word Pattern
source: https://leetcode.com/problems/word-pattern/description/?envType=study-plan-v2&envId=top-interview-150
created: 2026-07-12
difficulty: Easy
solved: true
tags: [String, Hash Table]
conceptIds: [hash-table]
stepTitles: [一方向のマッピング, 双方向のマッピング]
---
# Word Pattern
- Difficulty: Easy

## Question
Given a `pattern` and a string `s`, find if `s` follows the same pattern.

Here **follow** means a full match, such that there is a bijection between a letter in `pattern` and a **non-empty** word in `s`. Specifically:

- Each letter in `pattern` maps to **exactly** one unique word in `s`.
- Each unique word in `s` maps to **exactly** one letter in `pattern`.
- No two letters map to the same word, and no two words map to the same letter.

**Example 1:**

**Input:** pattern = "abba", s = "dog cat cat dog"

**Output:** true

**Explanation:**

- `'a'` maps to `"dog"`.
- `'b'` maps to `"cat"`.

**Example 2:**

**Input:** pattern = "abba", s = "dog cat cat fish"

**Output:** false

**Example 3:**

**Input:** pattern = "aaaa", s = "dog cat cat dog"

**Output:** false

**Constraints:**

- `1 <= pattern.length <= 300`
- `pattern` contains only lower-case English letters.
- `1 <= s.length <= 3000`
- `s` contains only lowercase English letters and spaces `' '`.
- `s` **does not contain** any leading or trailing spaces.
- All the words in `s` are separated by a **single space**.

## Approach
### Step 1
#### 思考
 - 単語と文字を紐づける。
 - `pattern` を走査して、既存の文字列に合致しているか確認する。
#### 実装
```python
class Solution:
    def wordPattern(self, pattern: str, s: str) -> bool:
        s_list = s.split(" ")
        map_ps = {}

        for p, c in zip(pattern, s_list):
            if p in map_ps and map_ps[p] != c:
                return False
            map_ps[p] = c
        return True
```
#### 注意点
 - `zip` が短い方に合わせて終了するため、要素数が異なる場合を正しく評価できない。
 - 双方向のマッピングを検証する必要がある。
#### パフォーマンス
 - Time complexity : $O(n)$
 - Space complexity: $O(n)$

### Step 2
#### 思考
 - `pattern` と単語の数が一致することを最初に確認する。
 - 文字から単語、単語から文字の両方向を記録し、全単射になっているか検証する。
#### 実装
```python
class Solution:
    def wordPattern(self, pattern: str, s: str) -> bool:
        words = s.split()

        if len(pattern) != len(words):
            return False

        pattern_to_word = {}
        word_to_pattern = {}

        for p, word in zip(pattern, words):
            if p in pattern_to_word and pattern_to_word[p] != word:
                return False

            if word in word_to_pattern and word_to_pattern[word] != p:
                return False

            pattern_to_word[p] = word
            word_to_pattern[word] = p

        return True
```
#### 注意点
 - 一方向だけでは、異なる文字が同じ単語へ対応するケースを検出できない。
#### パフォーマンス
 - Time complexity : $O(n)$
 - Space complexity: $O(n)$
