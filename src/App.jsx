// ゲームのメインコンポーネント

import React, { useState, useEffect } from 'react';
import TweetCard from './components/TweetCard';
import ReplyOption from './components/ReplyOption';
import GaugeBar from './components/GaugeBar';
import LanguageSwitcher from './components/LanguageSwitcher';
import { GameState } from './utils/gameLogic';
import { getRandomBadwords } from './utils/wordUtils';

function App() {
  const [gameState] = useState(() => new GameState());
  const [currentState, setCurrentState] = useState(gameState.getState());
  const [badwordOptions, setBadwordOptions] = useState([]);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('ja');

  // ゲーム開始時に悪口オプションを生成
  useEffect(() => {
    generateNewOptions(currentLanguage);
  }, [currentLanguage]);

  const generateNewOptions = (language = currentLanguage) => {
    const newOptions = getRandomBadwords(language);
    setBadwordOptions(newOptions);
  };

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    gameState.setLanguage(language);
    // 言語が変わったら新しい選択肢を生成（新しい言語を直接渡す）
    setTimeout(() => {
      generateNewOptions(language);
    }, 100);
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
        generateNewOptions(currentLanguage);
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
    generateNewOptions(currentLanguage);
    setIsProcessing(false);
  };

  // 言語に応じたテキストを取得
  const getText = (jaText, ruText) => {
    return currentLanguage === 'ja' ? jaText : ruText;
  };

  const GameOverScreen = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <div className="text-6xl mb-4">
          {currentState.winner === 'player' ? '🎉' : '😵'}
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">
          {currentState.winner === 'player' 
            ? getText('勝利！', 'Победа!') 
            : getText('ゲームオーバー', 'Игра окончена')}
        </h2>
        <p className="text-gray-300 mb-6">
          {currentState.winner === 'player' 
            ? getText('相手のメンタルを完全に破壊しました！', 'Вы полностью сломали психику соперника!') 
            : getText('ブロックされてしまいました...', 'Вас заблокировали...')}
        </p>
        <button
          onClick={resetGame}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          {getText('もう一度プレイ', 'Играть снова')}
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
          <div className="flex items-center gap-4">
            <LanguageSwitcher 
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />
            <button
              onClick={resetGame}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {getText('リセット', 'Сброс')}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        {/* ゲージエリア */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3 text-blue-400">
              {getText('あなたのメンタル', 'Ваша психика')}
            </h3>
            <GaugeBar 
              label="HP" 
              value={currentState.playerHp} 
              type="hp"
            />
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3 text-red-400">
              {getText('相手のメンタル', 'Психика соперника')}
            </h3>
            <GaugeBar 
              label="HP" 
              value={currentState.npcHp} 
              type="hp"
            />
          </div>
        </div>

        {/* ブロック率ゲージ */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold mb-3 text-yellow-400">
            {getText('ブロック危険度', 'Риск блокировки')}
          </h3>
          <GaugeBar 
            label={getText('ブロック率', 'Риск блока')} 
            value={currentState.blockRisk * 100} 
            maxValue={100}
            type="block"
          />
        </div>

        {/* 相手のツイート */}
        <TweetCard 
          username={getText('レスバ太郎', 'Спорщик Петя')}
          handle={getText('@resbatarou', '@sporshchik_petya')}
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
            {isProcessing 
              ? getText('処理中...', 'Обработка...') 
              : getText('返信を選択してください', 'Выберите ответ')}
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
            <h4 className="font-bold text-sm text-gray-300 mb-2">
              🎮 {getText('ゲームルール', 'Правила игры')}
            </h4>
            <ul className="text-xs text-gray-400 space-y-1">
              {currentLanguage === 'ja' ? (
                <>
                  <li>• 相手のメンタルHPを0にすれば勝利！</li>
                  <li>• 強い悪口ほどダメージが大きいが、ブロック率も上がる</li>
                  <li>• ブロックされたら即ゲームオーバー</li>
                  <li>• バランスを考えて攻撃しよう！</li>
                </>
              ) : (
                <>
                  <li>• Нанесите сопернику урон до 0 ментального HP, чтобы выиграть!</li>
                  <li>• Чем сильнее оскорбление, тем больше урон, но и риск блокировки выше</li>
                  <li>• Если вас заблокировали, игра окончена</li>
                  <li>• Атакуйте, учитывая баланс!</li>
                </>
              )}
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
