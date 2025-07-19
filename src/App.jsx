import React, { useState, useEffect } from 'react';
import TweetCard from './components/TweetCard';
import ReplyOption from './components/ReplyOption';
import GaugeBar from './components/GaugeBar';
import LanguageSwitcher from './components/LanguageSwitcher';
import { generateTweet, generateReplyOptions } from './utils/gameLogic';
import { calculateDamage, getRandomBadword, getRandomTweet } from './utils/wordUtils';

// Confetti component for victory animation
const Confetti = () => {
  const confettiPieces = Array.from({ length: 50 }, (_, i) => (
    <div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-red-500 animate-bounce"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${1 + Math.random()}s`
      }}
    />
  ));
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces}
    </div>
  );
};

function App() {
  const [language, setLanguage] = useState('ja');
  const [difficulty, setDifficulty] = useState('Normal');
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'gameOver', 'victory'
  const [currentTweet, setCurrentTweet] = useState('');
  const [replyOptions, setReplyOptions] = useState([]);
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);
  const [gameStats, setGameStats] = useState({
    totalDamageDealt: 0,
    totalDamageReceived: 0,
    successfulReplies: 0,
    blockedAttacks: 0
  });
  const [lastAction, setLastAction] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Difficulty settings
  const difficultySettings = {
    Easy: {
      playerHP: 150,
      enemyHP: 80,
      playerAttackMultiplier: 1.3,
      enemyAttackMultiplier: 0.7,
      playerBlockRate: 0.4,
      enemyBlockRate: 0.2,
      enemyCounterAttackRate: 0.2,
      enemyCounterDamage: 8
    },
    Normal: {
      playerHP: 100,
      enemyHP: 100,
      playerAttackMultiplier: 1.0,
      enemyAttackMultiplier: 1.0,
      playerBlockRate: 0.3,
      enemyBlockRate: 0.3,
      enemyCounterAttackRate: 0.3,
      enemyCounterDamage: 12
    }
  };

  const currentSettings = difficultySettings[difficulty];

  const maxPlayerHP = currentSettings.playerHP;
  const maxEnemyHP = currentSettings.enemyHP;

  const startGame = () => {
    setPlayerHP(currentSettings.playerHP);
    setEnemyHP(currentSettings.enemyHP);
    setGameStats({
      totalDamageDealt: 0,
      totalDamageReceived: 0,
      successfulReplies: 0,
      blockedAttacks: 0
    });
    setLastAction(null);
    setShowConfetti(false);
    generateNewTweet();
    setGameState('playing');
  };

  const generateNewTweet = () => {
    const tweet = generateTweet(language);
    const options = generateReplyOptions(language);
    setCurrentTweet(tweet);
    setReplyOptions(options);
  };

  const handleReplySelect = (selectedReply) => {
    const damage = calculateDamage(selectedReply, currentSettings.playerAttackMultiplier);
    
    // Check if enemy blocks
    const enemyBlocked = Math.random() < currentSettings.enemyBlockRate;
    let actualDamage = enemyBlocked ? Math.floor(damage * 0.3) : damage;
    
    // Update enemy HP
    const newEnemyHP = Math.max(0, enemyHP - actualDamage);
    setEnemyHP(newEnemyHP);
    
    // Update stats
    setGameStats(prev => ({
      ...prev,
      totalDamageDealt: prev.totalDamageDealt + actualDamage,
      successfulReplies: prev.successfulReplies + 1,
      blockedAttacks: enemyBlocked ? prev.blockedAttacks + 1 : prev.blockedAttacks
    }));

    let actionText = `あなたの攻撃: ${actualDamage}ダメージ`;
    if (enemyBlocked) {
      actionText += ' (ブロックされた!)';
    }

    // Check if enemy is defeated
    if (newEnemyHP <= 0) {
      setLastAction(actionText + '\n🎉 敵を倒した！');
      setGameState('victory');
      setShowConfetti(true);
      return;
    }

    // Enemy counter-attack
    let counterAttackText = '';
    if (Math.random() < currentSettings.enemyCounterAttackRate) {
      const counterDamage = currentSettings.enemyCounterDamage;
      
      // Check if player blocks counter-attack
      const playerBlocked = Math.random() < currentSettings.playerBlockRate;
      const actualCounterDamage = playerBlocked ? Math.floor(counterDamage * 0.3) : counterDamage;
      
      const newPlayerHP = Math.max(0, playerHP - actualCounterDamage);
      setPlayerHP(newPlayerHP);
      
      counterAttackText = `\n敵の反撃: ${actualCounterDamage}ダメージ`;
      if (playerBlocked) {
        counterAttackText += ' (ブロックした!)';
      }
      
      setGameStats(prev => ({
        ...prev,
        totalDamageReceived: prev.totalDamageReceived + actualCounterDamage
      }));

      // Check if player is defeated
      if (newPlayerHP <= 0) {
        setLastAction(actionText + counterAttackText + '\n💀 あなたの負け...');
        setGameState('gameOver');
        return;
      }
    }

    setLastAction(actionText + counterAttackText);

    // Generate new tweet after a short delay
    setTimeout(() => {
      generateNewTweet();
    }, 1500);
  };

  const resetGame = () => {
    setGameState('menu');
    setCurrentTweet('');
    setReplyOptions([]);
    setLastAction(null);
    setShowConfetti(false);
  };

  const toggleDifficulty = () => {
    setDifficulty(prev => prev === 'Easy' ? 'Normal' : 'Easy');
  };

  // Victory messages
  const victoryMessages = [
    '🎊 完璧な勝利です！',
    '⚡ 素晴らしい戦いでした！',
    '🏆 チャンピオンの誕生です！',
    '🌟 見事な勝利を収めました！',
    '🔥 圧倒的な強さでした！'
  ];

  const randomVictoryMessage = victoryMessages[Math.floor(Math.random() * victoryMessages.length)];

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-2">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-6 text-center transform hover:scale-105 transition-transform">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">ReplyBrawl</h1>
            <p className="text-gray-600 mb-6 text-sm">最強のリプライで敵を倒せ！</p>
            
            <div className="mb-6">
              <LanguageSwitcher language={language} setLanguage={setLanguage} />
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-center gap-4 mb-2">
                <span className="text-sm font-medium text-gray-700">難易度:</span>
                <button
                  onClick={toggleDifficulty}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    difficulty === 'Easy'
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-red-500 text-white shadow-lg'
                  }`}
                >
                  {difficulty}
                </button>
              </div>
              <div className="text-xs text-gray-500">
                {difficulty === 'Easy' ? (
                  <div>
                    <div>プレイヤー: HP +50%, 攻撃力 +30%</div>
                    <div>敵: HP -20%, ブロック率低下, 反撃弱体化</div>
                  </div>
                ) : (
                  <div>標準的な難易度です</div>
                )}
              </div>
            </div>
            
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ゲーム開始
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'victory') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center p-2">
        {showConfetti && <Confetti />}
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-6 text-center transform animate-pulse">
            <div className="text-6xl mb-4 animate-bounce">🏆</div>
            <h2 className="text-2xl font-bold text-yellow-600 mb-2 animate-pulse">
              {randomVictoryMessage}
            </h2>
            <div className="text-gray-700 mb-6 space-y-1 text-sm">
              <p>🗡️ 総ダメージ: {gameStats.totalDamageDealt}</p>
              <p>🛡️ 受けたダメージ: {gameStats.totalDamageReceived}</p>
              <p>🎯 成功したリプライ: {gameStats.successfulReplies}</p>
              <p>⚔️ ブロックした攻撃: {gameStats.blockedAttacks}</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                もう一度プレイ
              </button>
              <button
                onClick={resetGame}
                className="w-full bg-gray-500 text-white font-bold py-2 px-6 rounded-xl hover:bg-gray-600 transition-all duration-200"
              >
                メニューに戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-black flex items-center justify-center p-2">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-6 text-center">
            <div className="text-6xl mb-4">💀</div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">ゲームオーバー</h2>
            <div className="text-gray-700 mb-6 space-y-1 text-sm">
              <p>🗡️ 総ダメージ: {gameStats.totalDamageDealt}</p>
              <p>🛡️ 受けたダメージ: {gameStats.totalDamageReceived}</p>
              <p>🎯 成功したリプライ: {gameStats.successfulReplies}</p>
              <p>⚔️ ブロックした攻撃: {gameStats.blockedAttacks}</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                リトライ
              </button>
              <button
                onClick={resetGame}
                className="w-full bg-gray-500 text-white font-bold py-2 px-6 rounded-xl hover:bg-gray-600 transition-all duration-200"
              >
                メニューに戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-2">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-bold text-gray-800">ReplyBrawl</h1>
            <button
              onClick={toggleDifficulty}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                difficulty === 'Easy'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {difficulty}
            </button>
          </div>
          
          {/* HP Gauges */}
          <div className="space-y-2">
            <GaugeBar 
              label="あなた" 
              current={playerHP} 
              max={maxPlayerHP} 
              color="bg-green-500" 
            />
            <GaugeBar 
              label="敵" 
              current={enemyHP} 
              max={maxEnemyHP} 
              color="bg-red-500" 
            />
          </div>
          
          {/* Language Switcher */}
          <div className="mt-3">
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
          </div>
        </div>

        {/* Tweet Card */}
        <TweetCard tweet={currentTweet} />

        {/* Action Log */}
        {lastAction && (
          <div className="bg-white rounded-xl shadow-lg p-3 mb-4">
            <div className="text-sm text-gray-700 whitespace-pre-line">
              {lastAction}
            </div>
          </div>
        )}

        {/* Reply Options */}
        <div className="space-y-2">
          {replyOptions.map((option, index) => (
            <ReplyOption
              key={index}
              text={option}
              onClick={() => handleReplySelect(option)}
            />
          ))}
        </div>

        {/* Quit Button */}
        <div className="mt-4">
          <button
            onClick={resetGame}
            className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-gray-700 transition-all duration-200"
          >
            ゲーム終了
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
