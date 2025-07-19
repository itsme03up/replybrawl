// gameLogic.js
// メンタルHPとブロック確率の管理ロジック。悪口選択に応じて数値を更新。

import { calculateDamage, calculateBlockRisk, getNpcReaction, calculateNpcCounterDamage, getNpcCounterAttack } from './wordUtils.js';

/**
 * ゲーム状態を管理するクラス
 */
export class GameState {
  constructor() {
    this.language = 'ja';
    this.isEasyMode = false;
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
   * 難易度を設定
   * @param {boolean} isEasyMode - イージーモードかどうか
   */
  setDifficulty(isEasyMode) {
    this.isEasyMode = isEasyMode;
  }

  /**
   * プレイヤーが悪口を選択した時の処理
   * @param {Object} selectedBadword - 選択された悪口オブジェクト
   * @returns {Object} 更新結果
   */
  processPlayerAttack(selectedBadword) {
    const baseDamage = calculateDamage(selectedBadword);
    const damage = this.isEasyMode ? Math.floor(baseDamage * 1.5) : baseDamage;
    
    const baseBlockRisk = calculateBlockRisk(selectedBadword);
    // イージーモードではブロック確率を大幅に下げる
    const blockRisk = this.isEasyMode ? baseBlockRisk * 0.3 : baseBlockRisk * 0.7;
    
    // ブロックされるかの判定（累積ではなく単発の確率に変更）
    const currentBlockChance = this.isEasyMode ? blockRisk * 0.8 : blockRisk;
    const isBlocked = Math.random() < currentBlockChance;
    
    if (isBlocked) {
      this.gameOver = true;
      this.winner = 'npc';
      const messages = {
        ja: "ブロックされました！相手の勝利です😵",
        ru: "Заблокировали! Победа противника 😵"
      };
      return {
        damage: 0,
        counterDamage: 0,
        blocked: true,
        message: messages[this.language] || messages.ja,
        counterMessage: '',
        gameOver: true
      };
    }

    // ダメージを与える
    this.npcHp = Math.max(0, this.npcHp - damage);
    // ブロック確率の累積を緩やかにする
    this.blockRisk += blockRisk * 0.3;
    
    // 履歴に追加
    this.history.push({
      type: 'player',
      text: selectedBadword.word,
      damage: damage
    });

    // NPCの反撃処理（NPCがまだ生きている場合）
    let counterDamage = 0;
    let counterMessage = '';
    let npcCounterText = '';
    
    if (this.npcHp > 0) {
      const baseCounterDamage = calculateNpcCounterDamage(this.npcHp, damage);
      // 反撃ダメージを大幅に削減
      counterDamage = this.isEasyMode ? Math.floor(baseCounterDamage * 0.4) : Math.floor(baseCounterDamage * 0.6);
      this.playerHp = Math.max(0, this.playerHp - counterDamage);
      npcCounterText = getNpcCounterAttack(this.npcHp, counterDamage, this.language);
      
      const counterMessages = {
        ja: `NPCの反撃！ ${counterDamage}ダメージを受けた！`,
        ru: `Контратака NPC! Получено ${counterDamage} урона!`
      };
      counterMessage = counterMessages[this.language] || counterMessages.ja;
      
      // 履歴にNPCの反撃を追加
      this.history.push({
        type: 'npc',
        text: npcCounterText,
        damage: counterDamage
      });
    }

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
        counterDamage,
        blocked: false,
        message: gameMessages[this.language] || gameMessages.ja,
        counterMessage: '',
        gameOver: true
      };
    }

    // プレイヤーの敗北判定
    if (this.playerHp <= 0) {
      this.gameOver = true;
      this.winner = 'npc';
      const defeatMessages = {
        ja: "あなたのメンタルが完全に破綻しました...😵",
        ru: "Ваша психика полностью сломлена... 😵"
      };
      this.npcReaction = npcCounterText || getNpcReaction(this.npcHp, this.language);
      return {
        damage,
        counterDamage,
        blocked: false,
        message: defeatMessages[this.language] || defeatMessages.ja,
        counterMessage,
        gameOver: true
      };
    }

    // NPCの反応を更新（反撃がない場合）
    if (!npcCounterText) {
      this.npcReaction = getNpcReaction(this.npcHp, this.language);
      
      // 履歴にNPCの反応を追加
      this.history.push({
        type: 'npc',
        text: this.npcReaction,
        damage: 0
      });
    } else {
      this.npcReaction = npcCounterText;
    }

    return {
      damage,
      counterDamage,
      blocked: false,
      message: `${damage}${this.language === 'ru' ? ' урона!' : 'ダメージ！'}`,
      counterMessage,
      gameOver: false
    };
  }

  /**
   * ゲームをリセット
   * @param {boolean} isEasyMode - イージーモードかどうか
   */
  reset(isEasyMode = false) {
    this.isEasyMode = isEasyMode;
    this.playerHp = isEasyMode ? 150 : 100; // イージーモードでは150HP
    this.npcHp = isEasyMode ? 80 : 100;     // イージーモードでは敵のHPを80に削減
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
