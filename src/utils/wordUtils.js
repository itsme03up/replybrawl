// wordUtils.js
// 悪口リストからランダムな選択肢を返すユーティリティ。強さに応じてダメージ倍率も返す。

import badwordsJa from '../data/badwords_ja.json';
import badwordsRu from '../data/badwords_ru.json';

// 利用可能な言語とデータ
const languages = {
  ja: { data: badwordsJa, name: '日本語', flag: '🇯🇵' },
  ru: { data: badwordsRu, name: 'Русский', flag: '🇷🇺' }
};

/**
 * 指定された言語でランダムに3つの悪口を選択して返す
 * @param {string} language - 言語コード (ja, ru)
 * @returns {Array} 3つの悪口オブジェクトの配列
 */
export function getRandomBadwords(language = 'ja') {
  console.log('getRandomBadwords called with language:', language);
  const languageData = languages[language];
  if (!languageData) {
    console.warn(`Unsupported language: ${language}, falling back to Japanese`);
    language = 'ja';
  }
  
  const data = languages[language].data;
  console.log('Using data for language:', language, 'data length:', data?.length);
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  const result = shuffled.slice(0, 3);
  console.log('Returning badwords:', result);
  return result;
}

/**
 * 利用可能な言語一覧を取得
 * @returns {Object} 言語情報のオブジェクト
 */
export function getAvailableLanguages() {
  return languages;
}

/**
 * 悪口の強さに基づいてダメージを計算
 * @param {Object} badword - 悪口オブジェクト
 * @returns {number} ダメージ値
 */
export function calculateDamage(badword) {
  return badword.damage || 10;
}

/**
 * 悪口の強さに基づいてブロック確率を計算
 * @param {Object} badword - 悪口オブジェクト
 * @returns {number} ブロック確率（0.0-1.0）
 */
export function calculateBlockRisk(badword) {
  return badword.block_risk || 0.1;
}

/**
 * ブロック判定を行う
 * @param {Object} badword - 悪口オブジェクト
 * @returns {boolean} ブロックされるかどうか
 */
export function isBlocked(badword) {
  return Math.random() < calculateBlockRisk(badword);
}

/**
 * ランダムにNPCの反応を選択（多言語対応）
 * @param {number} remainingHp - 残りHP
 * @param {string} language - 言語コード (ja, ru)
 * @returns {string} NPCの反応テキスト
 */
export function getNpcReaction(remainingHp, language = 'ja') {
  const reactions = {
    ja: {
      high: [
        "その程度？もっと本気出せよ😏",
        "まだまだ余裕だわ🤣",
        "そんな悪口で俺が怯むと思ってる？",
        "温すぎる。もう少し頑張れ💪"
      ],
      medium: [
        "おい...ちょっと待てよ😠",
        "だんだんムカついてきた...",
        "調子に乗るなよ？😤",
        "そろそろ本気で怒るぞ"
      ],
      low: [
        "やめろ！もうやめてくれ！😭",
        "くそ...負けるもんか...",
        "もう限界だ...💀",
        "参った...参ったよ..."
      ]
    },
    ru: {
      high: [
        "Это всё? Давай серьёзнее! 😏",
        "Пока ещё легко справляюсь 🤣",
        "Думаешь, такими словами меня задеть?",
        "Слабовато. Постарайся больше 💪"
      ],
      medium: [
        "Эй... подожди-ка! 😠",
        "Начинаю злиться...",
        "Не наглей! 😤",
        "Скоро серьёзно разозлюсь"
      ],
      low: [
        "Хватит! Остановись! 😭",
        "Чёрт... не сдамся...",
        "Уже предел... 💀",
        "Сдаюсь... сдаюсь..."
      ]
    }
  };

  const languageReactions = reactions[language] || reactions.ja;
  
  let category;
  if (remainingHp > 60) {
    category = 'high';
  } else if (remainingHp > 20) {
    category = 'medium';
  } else {
    category = 'low';
  }

  const categoryReactions = languageReactions[category];
  return categoryReactions[Math.floor(Math.random() * categoryReactions.length)];
}
