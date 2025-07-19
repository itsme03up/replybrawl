# ReplyBrawl 🎤💥

**多言語対応のTwitter風レスバゲーム**

相手のメンタルHPを削って勝利を目指せ！ただしブロックされたら即ゲームオーバー。

![Game Screenshot](https://via.placeholder.com/600x400/1a1a1a/ffffff?text=ReplyBrawl+Game+Screenshot)

## 🎮 ゲーム概要

### 基本ルール
- 🎯 **目標**: 相手のメンタルHPを0にして勝利！
- ⚔️ **攻撃**: 3つの悪口から1つを選んでリプライ
- 🛡️ **ブロック**: 強すぎる悪口はブロックされるリスクが高い
- 💀 **敗北条件**: ブロックされる、またはあなたのHPが0になる
- 🔥 **反撃システム**: 相手も反撃してくる！あなたのHPも減る

### 🆕 最新機能
- ✨ **豪華な勝利演出** - コンフェッティアニメーション付き
- 🌍 **多言語対応** - 日本語・ロシア語対応
- 🎛️ **難易度選択** - Easy/Normalモード
- 📱 **完全レスポンシブ** - モバイル最適化済み
- ⚡ **反撃システム** - NPCが反撃、戦略性UP

### 難易度設定
| モード | プレイヤーHP | 敵HP | 攻撃力 | ブロック率 | 反撃ダメージ |
|--------|-------------|------|--------|------------|-------------|
| **Easy** | 150 (+50%) | 80 (-20%) | +50% | -70% | -60% |
| **Normal** | 100 | 100 | 標準 | 標準 | 標準 |

## 🚀 クイックスタート

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/replybrawl.git
cd replybrawl

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス

## 🧩 技術スタック

### フロントエンド
- **React** 18+ - メインフレームワーク
- **Tailwind CSS** - スタイリング
- **Vite** - ビルドツール

### データ処理
- **Python** - 悪口ファイルの変換処理
- **JSON** - 悪口データの管理

### 対応言語
- 🇯🇵 **日本語** - メイン言語
- 🇷🇺 **ロシア語** - 完全対応

## 📁 プロジェクト構造

```
replybrawl/
├── src/
│   ├── components/           # UIコンポーネント
│   │   ├── TweetCard.jsx     # Twitter風ツイート表示
│   │   ├── ReplyOption.jsx   # 悪口選択ボタン
│   │   ├── GaugeBar.jsx      # HPゲージ
│   │   └── LanguageSwitcher.jsx # 言語切替
│   ├── data/                 # 悪口データ
│   │   ├── badwords_ja.json  # 日本語悪口リスト
│   │   ├── badwords_ru.json  # ロシア語悪口リスト
│   │   └── *.txt             # 元データファイル
│   ├── utils/                # ユーティリティ
│   │   ├── gameLogic.js      # ゲーム状態管理
│   │   └── wordUtils.js      # 悪口処理・ダメージ計算
│   ├── App.jsx               # メインアプリ
│   ├── main.jsx              # エントリーポイント
│   └── index.css             # グローバルスタイル
├── scripts/
│   └── convert_badwords.py   # データ変換スクリプト
├── public/                   # 静的ファイル
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 UI/UX 特徴

### デザイン
- 🌙 **ダークテーマ** - 目に優しい黒基調
- 🎨 **グラデーション** - 美しい背景効果
- 💫 **アニメーション** - スムーズなトランジション
- 📱 **レスポンシブ** - 全デバイス対応

### ユーザビリティ
- ⚡ **高速レスポンス** - 瞬時の反応
- 🎯 **直感的操作** - 分かりやすいUI
- 🔊 **視覚的フィードバック** - 明確な状態表示
- 📊 **リアルタイム更新** - 即座のゲーム状態反映

## 🎲 ゲームメカニクス

### ダメージシステム
```javascript
// 基本ダメージ計算
const damage = badword.damage * difficultyMultiplier

// イージーモード: +50%
// ノーマルモード: 標準
```

### ブロック確率
```javascript
// 累積ブロック率計算
const blockChance = baseBlockRisk * difficultyModifier

// イージーモード: 基本確率 × 0.3
// ノーマルモード: 基本確率 × 0.7
```

### 反撃システム
```javascript
// NPC反撃ダメージ
const counterDamage = (baseDamage + desperationBonus + reactionBonus) * difficultyModifier

// イージーモード: -60%
// ノーマルモード: -40%
```

## 🗂️ データソース

悪口リストは以下のオープンソースプロジェクトから取得：

> **[LDNOOBW - List of Dirty, Naughty, Obscene, and Otherwise Bad Words](https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words)**

### データ処理
```bash
# 悪口データの変換
python scripts/convert_badwords.py
```

## 🛠️ 開発ガイド

### 新しい言語を追加する方法

1. **悪口リストを準備**
```
src/data/badwords_[言語コード].txt
```

2. **JSONに変換**
```bash
python scripts/convert_badwords.py
```

3. **wordUtils.jsに言語データを追加**
```javascript
const languages = {
  ja: { data: badwordsJa, name: '日本語', flag: '🇯🇵' },
  ru: { data: badwordsRu, name: 'Русский', flag: '🇷🇺' },
  // 新しい言語を追加
  en: { data: badwordsEn, name: 'English', flag: '🇺🇸' }
};
```

### コンポーネント設計

各コンポーネントは明確な責任を持つ：

- **App.jsx** - ゲーム状態管理、UI統合
- **TweetCard.jsx** - Twitter風ツイート表示
- **ReplyOption.jsx** - 悪口選択インターフェース
- **GaugeBar.jsx** - HP/ブロック率の視覚化
- **LanguageSwitcher.jsx** - 言語切替機能

## 🧪 テスト

```bash
# 全テスト実行
npm test

# 特定のテスト
npm test -- --grep "GameState"

# カバレッジ確認
npm run test:coverage
```

## 📈 パフォーマンス

### 最適化済み機能
- ⚡ **React.memo** - 不要な再レンダリング防止
- 🗜️ **Lazy Loading** - コンポーネントの遅延読み込み
- 📦 **Code Splitting** - バンドルサイズ最適化
- 🔄 **useCallback/useMemo** - 計算結果のキャッシュ

### 動作環境
- **対応ブラウザ**: Chrome 80+, Firefox 75+, Safari 13+
- **Node.js**: 16.x以上推奨
- **画面サイズ**: 320px～対応

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### 開発ルール
- 🧪 新機能には必ずテストを追加
- 📝 コードにはコメントを記述
- 🎨 Tailwind CSSのクラスを使用
- 🌍 多言語対応を考慮

## 📄 ライセンス

- **ゲームコード**: MIT License

## 🙏 クレジット

- **アイコン**: Tailwind CSS Icons
- **フォント**: システムフォント

---

**Made with ❤️ and ☕ by the ReplyBrawl Team**

🎮 **楽しいレスバライフを！** 🎮
