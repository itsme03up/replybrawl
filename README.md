その通り！
Copilotくん、便利だけど「指示が曖昧だと勝手に大喜利はじめる」から、**こっちでガチガチに構造と方針決めておくのが一番効率良い**。
というわけで、**Copilotが暴走しにくい、正確で細かいREADME雛形**を用意したよ👇

---

## ✅ `README.md`（Copilot制御に最適化済）

```markdown
# ReplyBrawl 🎤💥

Twitter風UIの中で、悪口を選んで相手のメンタルゲージを削り合う「レスバゲーム」。

---

## 🎮 ゲーム概要

- プレイヤーは3つの悪口から1つを選び、相手にリプライします
- 相手のメンタルゲージ（HP）を0にすれば勝利！
- ただし、強すぎる悪口はブロックされるリスクが上がります
- **目標：「ブロックされる前に叩き込め！」**

---

## 🧩 技術スタック

- React
- Tailwind CSS
- Python（悪口ファイルの変換に使用）
- LocalStorage（状態の保存）

---

## 📁 ディレクトリ構成

```

replybrawl/
├── public/                     # 静的ファイル
├── src/
│   ├── components/             # 再利用可能なUI部品
│   │   ├── TweetCard.jsx       # 相手のセリフ表示（Twitter風）
│   │   ├── ReplyOption.jsx     # 悪口ボタン
│   │   └── GaugeBar.jsx        # メンタルゲージUI
│   ├── data/
│   │   └── badwords\_ja.txt     # 日本語の悪口リスト（LDNOOBWから取得）
│   ├── utils/
│   │   ├── wordUtils.js        # ランダム選択、ダメージ計算など
│   │   └── gameLogic.js        # メンタル・ブロック判定処理
│   ├── App.jsx                 # ゲームのメインコンポーネント
│   └── index.js                # エントリーポイント
├── scripts/
│   └── convert\_badwords.py     # テキスト → JSON 変換用Pythonスクリプト
├── README.md
├── package.json
└── vite.config.js（または CRAの設定ファイル）

````

---

## ⚙️ セットアップ手順

1. このリポジトリをクローン
2. 必要パッケージをインストール

```bash
npm install
````

3. 開発サーバーを起動

```bash
npm run dev
```

---

## 🧠 データ元

悪口リストは以下のレポジトリを参照：

> [https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words](https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words)

必要な言語ファイル（例：`ja`）のみ `src/data` に配置。

---

## 🤖 Copilotへの指示用コメント（ソース内）

各ファイルの冒頭には次のようなコメントを記述し、Copilotが迷わないようにします。

```jsx
// TweetCard.jsx
// 表示用コンポーネント。相手のプロフィール画像・名前・セリフをTwitter風に表示。
```

```js
// wordUtils.js
// 悪口リストからランダムな選択肢を返すユーティリティ。強さに応じてダメージ倍率も返す。
```

```js
// gameLogic.js
// メンタルHPとブロック確率の管理ロジック。悪口選択に応じて数値を更新。
```

---

## ✅ TODO（Copilotが拾えるように）

* [ ] `TweetCard.jsx` を作成する
* [ ] `ReplyOption.jsx` で選択肢を表示・クリック処理を書く
* [ ] HPとブロック確率の更新ロジックを組む（`gameLogic.js`）
* [ ] 勝利 / ブロック時のエンド画面を作る
* [ ] 人格別の反応テンプレートを導入

---

## 📄 ライセンス

* ゲームコード: MIT
* 悪口リスト: [LDNOOBW](https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words) に準拠

