// App.jsx
// ゲームのメインコンポーネント

import React, { useState, useEffect } from 'react';
import TweetCard from './components/TweetCard';
import ReplyOption from './components/ReplyOption';
import GaugeBar from './components/GaugeBar';
import { GameState } from './utils/gameLogic';
import { getRandomBadwords } from './utils/wordUtils';

function App() {
  const [gameState] = useState(() => new GameState());
  const [currentState, setCurrentState] = useState(gameState.getState());
  const [badwordOptions, setBadwordOptions] = useState([]);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // ゲーム開始時に悪口オプションを生成
  useEffect(() => {
    generateNewOptions();
  }, []);

  const generateNewOptions = () => {
    const newOptions = getRandomBadwords();
    setBadwordOptions(newOptions);
  };

  const handleBadwordSelect = async (selectedBadword) => {
    if (isProcessing || currentState.gameOver) return;
    
    setIsProcessing(true);
    setMessage('');

    // 攻撃を処理
    const result = gameState.processPlayerAttack(selectedBadword);
    const newState = gameState.getState();
    
    setCurrentState(newState);
    setMessage(result.message);

    // ゲームが終了していない場合、新しい選択肢を生成
    if (!result.gameOver) {
      setTimeout(() => {
        generateNewOptions();
        setIsProcessing(false);
      }, 2000);
    } else {
      setIsProcessing(false);
    }
  };

  const resetGame = () => {
    gameState.reset();
    setCurrentState(gameState.getState());
    setMessage('');
    generateNewOptions();
    setIsProcessing(false);
  };

  const GameOverScreen = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <div className="text-6xl mb-4">
          {currentState.winner === 'player' ? '🎉' : '😵'}
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">
          {currentState.winner === 'player' ? '勝利！' : 'ゲームオーバー'}
        </h2>
        <p className="text-gray-300 mb-6">
          {currentState.winner === 'player' 
            ? '相手のメンタルを完全に破壊しました！' 
            : 'ブロックされてしまいました...'}
        </p>
        <button
          onClick={resetGame}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          もう一度プレイ
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ヘッダー */}
      <header className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-400">ReplyBrawl 🎤💥</h1>
          <button
            onClick={resetGame}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            リセット
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        {/* ゲージエリア */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3 text-blue-400">あなたのメンタル</h3>
            <GaugeBar 
              label="HP" 
              value={currentState.playerHp} 
              type="hp"
            />
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3 text-red-400">相手のメンタル</h3>
            <GaugeBar 
              label="HP" 
              value={currentState.npcHp} 
              type="hp"
            />
          </div>
        </div>

        {/* ブロック率ゲージ */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold mb-3 text-yellow-400">ブロック危険度</h3>
          <GaugeBar 
            label="ブロック率" 
            value={currentState.blockRisk * 100} 
            maxValue={100}
            type="block"
          />
        </div>

        {/* 相手のツイート */}
        <TweetCard 
          username="レスバ太郎"
          handle="@resbatarou"
          text={currentState.npcReaction}
        />

        {/* メッセージエリア */}
        {message && (
          <div className="bg-blue-900 border border-blue-700 rounded-lg p-4 mb-4 text-center">
            <p className="text-blue-200 font-medium">{message}</p>
          </div>
        )}

        {/* 返信オプション */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-center">
            {isProcessing ? '処理中...' : '返信を選択してください'}
          </h3>
          
          <div className="space-y-4">
            {badwordOptions.map((badword, index) => (
              <ReplyOption
                key={`${badword.word}-${index}`}
                badword={badword}
                onSelect={handleBadwordSelect}
                disabled={isProcessing || currentState.gameOver}
              />
            ))}
          </div>

          {/* ゲーム説明 */}
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h4 className="font-bold text-sm text-gray-300 mb-2">🎮 ゲームルール</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• 相手のメンタルHPを0にすれば勝利！</li>
              <li>• 強い悪口ほどダメージが大きいが、ブロック率も上がる</li>
              <li>• ブロックされたら即ゲームオーバー</li>
              <li>• バランスを考えて攻撃しよう！</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ゲームオーバースクリーン */}
      {currentState.gameOver && <GameOverScreen />}
    </div>
  );
}

export default App;
