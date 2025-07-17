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
  const languageData = languages[language];
  if (!languageData) {
    console.warn(`Unsupported language: ${language}, falling back to Japanese`);
    language = 'ja';
  }
  
  const data = languages[language].data;
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
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

/**
 * NPCがプレイヤーに対して反撃する際のダメージを計算
 * @param {number} npcHp - NPCの残りHP
 * @param {number} playerAttackDamage - プレイヤーが与えたダメージ
 * @returns {number} NPCの反撃ダメージ
 */
export function calculateNpcCounterDamage(npcHp, playerAttackDamage) {
  // NPCのHPが低いほど、また受けたダメージが大きいほど反撃が強くなる
  const desperation = (100 - npcHp) / 100; // 0.0 - 1.0の絶望度
  const reactionStrength = playerAttackDamage / 30; // 受けたダメージに対する反応
  
  // 基本ダメージ + 絶望ボーナス + 反応ボーナス
  const baseDamage = 8 + Math.random() * 7; // 8-15のベースダメージ
  const desperationBonus = desperation * 10; // 最大10の絶望ボーナス
  const reactionBonus = reactionStrength * 5; // 最大5の反応ボーナス
  
  return Math.floor(baseDamage + desperationBonus + reactionBonus);
}

/**
 * NPCの反撃時の台詞を取得
 * @param {number} npcHp - NPCの残りHP
 * @param {number} counterDamage - 反撃ダメージ
 * @param {string} language - 言語コード
 * @returns {string} 反撃時の台詞
 */
export function getNpcCounterAttack(npcHp, counterDamage, language = 'ja') {
  const counterAttacks = {
    ja: {
      high: [
        "じゃあこっちからも行くぞ！お前の方こそバカだろ！😤",
        "甘い！俺の方が口が悪いんだよ！💢",
        "反撃だ！お前なんて全然大したことないな！🔥",
        "やり返してやる！お前の悪口はレベルが低い！⚡"
      ],
      medium: [
        "くそ...でも負けるかよ！お前もクズだろうが！😠",
        "ムカつく...だったらお前だって最低野郎だ！💀",
        "やられっぱなしじゃいられない！お前も同類だ！🌪️",
        "こうなったら...お前の方がもっとヤバい奴だ！⚡"
      ],
      low: [
        "最後の一撃だ...お前も道連れにしてやる！😈",
        "もう何も失うものはない...お前を地獄に送る！💀",
        "死なばもろとも！お前も終わりだ！🔥",
        "最期の力で...お前のメンタルも砕いてやる！⚡"
      ]
    },
    ru: {
      high: [
        "Тогда и я пойду в атаку! Ты сам дурак! 😤",
        "Легко! У меня язык поострее! 💢",
        "Контратака! Ты вообще ничего не стоишь! 🔥",
        "Отвечу тем же! Твои оскорбления слабые! ⚡"
      ],
      medium: [
        "Чёрт... но не сдамся! Ты сам отброс! 😠",
        "Бесит... тогда ты тоже последний негодяй! 💀",
        "Не буду просто терпеть! Ты такой же! 🌪️",
        "Раз так... ты ещё хуже меня! ⚡"
      ],
      low: [
        "Последний удар... утащу тебя с собой! 😈",
        "Терять больше нечего... отправлю в ад! 💀",
        "Умрём вместе! И ты тоже конец! 🔥",
        "Последними силами... сломаю и твою психику! ⚡"
      ]
    }
  };

  const languageAttacks = counterAttacks[language] || counterAttacks.ja;
  
  let category;
  if (npcHp > 60) {
    category = 'high';
  } else if (npcHp > 20) {
    category = 'medium';
  } else {
    category = 'low';
  }

  const categoryAttacks = languageAttacks[category];
  return categoryAttacks[Math.floor(Math.random() * categoryAttacks.length)];
}
