// gameLogic.js
// メンタルHPとブロック確率の管理ロジック。悪口選択に応じて数値を更新。

import { calculateDamage, calculateBlockRisk, getNpcReaction } from './wordUtils.js';

/**
 * ゲーム状態を管理するクラス
 */
export class GameState {
  constructor() {
    this.language = 'ja';
    this.playerHp = 100;
    this.npcHp = 100;
    this.blockRisk = 0;
    this.gameOver = false;
    this.winner = null;
    this.npcReaction = this.getInitialMessage();
    this.history = [];
  }

  /**
   * 初期メッセージを言語に応じて取得
   */
  getInitialMessage() {
    const messages = {
      ja: "よろしく、始めようか😎",
      ru: "Начнём, что ли? 😎"
    };
    return messages[this.language] || messages.ja;
  }

  /**
   * 言語を変更
   * @param {string} newLanguage - 新しい言語コード
   */
  setLanguage(newLanguage) {
    this.language = newLanguage;
    if (!this.gameOver) {
      this.npcReaction = this.getInitialMessage();
    }
  }

  /**
   * プレイヤーが悪口を選択した時の処理
   * @param {Object} selectedBadword - 選択された悪口オブジェクト
   * @returns {Object} 更新結果
   */
  processPlayerAttack(selectedBadword) {
    const damage = calculateDamage(selectedBadword);
    const blockRisk = calculateBlockRisk(selectedBadword);
    
    // ブロックされるかの判定
    const isBlocked = Math.random() < (this.blockRisk + blockRisk);
    
    if (isBlocked) {
      this.gameOver = true;
      this.winner = 'npc';
      const messages = {
        ja: "ブロックされました！相手の勝利です😵",
        ru: "Заблокировали! Победа противника 😵"
      };
      return {
        damage: 0,
        blocked: true,
        message: messages[this.language] || messages.ja,
        gameOver: true
      };
    }

    // ダメージを与える
    this.npcHp = Math.max(0, this.npcHp - damage);
    this.blockRisk += blockRisk;
    
    // 履歴に追加
    this.history.push({
      type: 'player',
      text: selectedBadword.word,
      damage: damage
    });

    // 勝利判定
    if (this.npcHp <= 0) {
      this.gameOver = true;
      this.winner = 'player';
      const victoryMessages = {
        ja: "参った...お前の勝ちだ😵",
        ru: "Сдаюсь... ты победил 😵"
      };
      const gameMessages = {
        ja: "勝利！相手のメンタルを完全に破壊しました🎉",
        ru: "Победа! Полностью сломил противника 🎉"
      };
      this.npcReaction = victoryMessages[this.language] || victoryMessages.ja;
      return {
        damage,
        blocked: false,
        message: gameMessages[this.language] || gameMessages.ja,
        gameOver: true
      };
    }

    // NPCの反応を更新
    this.npcReaction = getNpcReaction(this.npcHp, this.language);
    
    // 履歴にNPCの反応を追加
    this.history.push({
      type: 'npc',
      text: this.npcReaction,
      damage: 0
    });

    return {
      damage,
      blocked: false,
      message: `${damage}${this.language === 'ru' ? ' урона!' : 'ダメージ！'}`,
      gameOver: false
    };
  }

  /**
   * ゲームをリセット
   */
  reset() {
    this.playerHp = 100;
    this.npcHp = 100;
    this.blockRisk = 0;
    this.gameOver = false;
    this.winner = null;
    this.npcReaction = this.getInitialMessage();
    this.history = [];
  }

  /**
   * 現在のゲーム状態を取得
   */
  getState() {
    return {
      playerHp: this.playerHp,
      npcHp: this.npcHp,
      blockRisk: this.blockRisk,
      gameOver: this.gameOver,
      winner: this.winner,
      npcReaction: this.npcReaction,
      history: this.history
    };
  }
}
