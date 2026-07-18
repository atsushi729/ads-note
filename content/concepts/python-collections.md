---
id: python-collections
name: Python Collections (list / set / dict)
nameJa: Pythonのデータ構造（list・set・dict）
kind: 構造
problemNumbers: []
complexity:
  - { op: 存在確認, avg: O(1), worst: O(n) }
  - { op: 末尾への追加, avg: O(1), worst: O(1) }
  - { op: インデックス取得, avg: O(1), worst: O(1) }
  - { op: キーから値を取得, avg: O(1), worst: O(1) }
studyNote: "「存在だけ確認したいなら set、キーと値を対応させたいなら dict、順序とインデックスが必要なら list」を判断基準にする。set/dict の O(1) はハッシュ表由来で、最悪ケースは衝突時の O(n)。"
---
Python で複数のデータをまとめて管理する代表的な構造は `list` / `set` / `dict` の 3 つ。

| 項目 | `list` | `set` | `dict` |
| --- | --- | --- | --- |
| 保持するデータ | 値の並び | 値のみ | キーと値 |
| 書き方 | `[1, 2, 3]` | `{1, 2, 3}` | `{"a": 1, "b": 2}` |
| 重複 | 可能 | 不可 | キーの重複は不可 |
| 順序 | 保持される | 順序を前提にしない | 挿入順を保持する |
| インデックス指定 | 可能 | 不可 | 不可 |
| 主な用途 | 順序ありデータ管理 | 存在確認・重複除去・集合演算 | キーと値の対応関係の管理 |
| 検索対象 | 値 | 値 | キー |
| 平均検索時間 | `O(n)` | `O(1)` | `O(1)` |
| 要素の追加 | `append()` | `add()` | `dict[key] = value` |
| 要素の取得 | `list[index]` | 直接取得は不可 | `dict[key]` |

### list

`list` は、複数の値を順番に管理するデータ構造。順序やインデックスが必要な場合に利用するが、値の存在確認は平均 `O(n)`。

```python
nums_list = list(nums)

print(nums_list[0])       # 100
print(200 in nums_list)   # True
```

### set

`set` は、重複しない値を管理するデータ構造。値の存在確認・重複除去が目的の場合に利用し、検索は平均 `O(1)`。インデックスは利用できない。

```python
nums_set = set(nums)

print(200 in nums_set)  # True
```

### dict

`dict` は、キーと値のセットで管理するデータ構造。数値にインデックスなどの追加情報が対応する場合に利用する。

```python
nums_dict = {
    num: index
    for index, num in enumerate(nums)
}

print(nums_dict[200])  # 2
```

### 使い分け

```text
list = 順序やインデックスが必要
set  = 値が存在するかだけ確認したい
dict = キーから対応する値を取得したい
```

| 操作 | `list` | `set` | `dict` |
| --- | --- | --- | --- |
| 存在確認 | `O(n)` | 平均 `O(1)` | 平均 `O(1)` |
| 末尾への追加 | 平均 `O(1)` | 平均 `O(1)` | 平均 `O(1)` |
| インデックス取得 | `O(1)` | 不可 | 不可 |
| キーから値を取得 | 不可 | 不可 | 平均 `O(1)` |
