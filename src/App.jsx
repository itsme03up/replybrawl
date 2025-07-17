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
  const [counterMessage, setCounterMessage] = useState('');
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
    setCounterMessage('');

    // 攻撃を処理
    const result = gameState.processPlayerAttack(selectedBadword);
    const newState = gameState.getState();
    
    setCurrentState(newState);
    setMessage(result.message);
    
    // 反撃メッセージがある場合は遅延表示
    if (result.counterMessage && !result.gameOver) {
      setTimeout(() => {
        setCounterMessage(result.counterMessage);
      }, 1500);
    }

    // ゲームが終了していない場合、新しい選択肢を生成
    if (!result.gameOver) {
      setTimeout(() => {
        generateNewOptions(currentLanguage);
        setIsProcessing(false);
        setCounterMessage('');
      }, 3000);
    } else {
      setIsProcessing(false);
    }
  };

  const resetGame = () => {
    gameState.reset();
    setCurrentState(gameState.getState());
    setMessage('');
    setCounterMessage('');
    generateNewOptions(currentLanguage);
    setIsProcessing(false);
  };

  // 言語に応じたテキストを取得
  const getText = (jaText, ruText) => {
    return currentLanguage === 'ja' ? jaText : ruText;
  };

  const GameOverScreen = () => {
    const isVictory = currentState.winner === 'player';
    
    // 勝利時のコンフェッティエフェクト
    const ConfettiPiece = ({ delay, leftPosition }) => (
      <div 
        className="confetti"
        style={{
          left: `${leftPosition}%`,
          animationDelay: `${delay}s`,
          background: `hsl(${Math.random() * 360}, 70%, 60%)`
        }}
      />
    );
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        {/* 勝利時のコンフェッティ */}
        {isVictory && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <ConfettiPiece 
                key={i} 
                delay={Math.random() * 3} 
                leftPosition={Math.random() * 100} 
              />
            ))}
          </div>
        )}
        
        <div className={`rounded-lg p-8 max-w-lg w-full mx-4 text-center transform transition-all duration-500 celebration ${
          isVictory 
            ? 'bg-gradient-to-br from-yellow-600 to-orange-700 shadow-2xl shadow-yellow-500/50 glow' 
            : 'bg-gray-800'
        }`}>
          {/* 勝利時の背景エフェクト */}
          {isVictory && (
            <>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-400/20 to-orange-500/20 sparkle"></div>
              <div className="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-lg bg-gradient-to-br from-yellow-300/30 to-orange-400/30 blur-sm"></div>
            </>
          )}
          
          <div className="relative z-10">
            <div className={`text-8xl mb-6 ${isVictory ? 'float' : ''}`}>
              {isVictory ? '👑' : '😵'}
            </div>
            
            <h2 className={`text-4xl font-bold mb-4 ${
              isVictory 
                ? 'text-yellow-100 victory-text' 
                : 'text-white'
            }`}>
              {isVictory 
                ? getText('🏆 完全勝利！ 🏆', '🏆 Полная победа! 🏆') 
                : currentState.playerHp <= 0
                  ? getText('メンタル敗北...', 'Ментальное поражение...')
                  : getText('ゲームオーバー', 'Игра окончена')}
            </h2>
            
            {isVictory && (
              <div className="text-2xl mb-4 text-yellow-200 font-semibold sparkle">
                {getText('レスバマスター', 'Мастер споров')}
              </div>
            )}
            
            <p className={`text-lg mb-8 leading-relaxed ${
              isVictory 
                ? 'text-yellow-100' 
                : 'text-gray-300'
            }`}>
              {isVictory 
                ? getText(
                    '相手のメンタルを完全に粉砕！\nあなたの議論スキルは最強です！', 
                    'Вы полностью сломали психику соперника!\nВаши навыки спора непревзойденны!'
                  ).split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i === 0 && <br />}
                    </span>
                  ))
                : currentState.playerHp <= 0
                  ? getText(
                      'あなたのメンタルが完全に破綻...\n相手の反撃に耐えられませんでした。',
                      'Ваша психика полностью сломлена...\nНе смогли выдержать контратаки соперника.'
                    ).split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i === 0 && <br />}
                      </span>
                    ))
                  : getText('ブロックされてしまいました...', 'Вас заблокировали...')}
            </p>
            
            {isVictory && (
              <div className="grid grid-cols-3 gap-4 mb-8 text-yellow-200">
                <div className="text-center float" style={{animationDelay: '0.2s'}}>
                  <div className="text-3xl mb-1">⚡</div>
                  <div className="text-sm font-medium">{getText('超攻撃力', 'Сверхсила')}</div>
                </div>
                <div className="text-center float" style={{animationDelay: '0.4s'}}>
                  <div className="text-3xl mb-1">🎯</div>
                  <div className="text-sm font-medium">{getText('完璧な戦略', 'Идеальная стратегия')}</div>
                </div>
                <div className="text-center float" style={{animationDelay: '0.6s'}}>
                  <div className="text-3xl mb-1">🧠</div>
                  <div className="text-sm font-medium">{getText('圧倒的知性', 'Превосходный интеллект')}</div>
                </div>
              </div>
            )}
            
            {isVictory && (
              <div className="text-yellow-300 text-lg mb-6 font-bold sparkle">
                {getText('🎊 おめでとうございます！ 🎊', '🎊 Поздравляем! 🎊')}
              </div>
            )}
            
            <button
              onClick={resetGame}
              className={`font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                isVictory
                  ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg hover:shadow-yellow-400/50 font-black'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {getText('もう一度プレイ', 'Играть снова')}
            </button>
          </div>
        </div>
      </div>
    );
  };

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

        {/* 反撃メッセージエリア */}
        {counterMessage && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-4 text-center animate-pulse">
            <p className="text-red-200 font-medium">
              <span className="text-red-300 font-bold">⚡ {getText('反撃', 'Контратака')}！ </span>
              {counterMessage}
            </p>
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
                  <li>• <span className="text-red-400 font-bold">⚡ NEW!</span> 相手も反撃してくる！あなたのHPも減る</li>
                  <li>• 強い悪口ほどダメージが大きいが、ブロック率も上がる</li>
                  <li>• ブロックされたら即ゲームオーバー</li>
                  <li>• あなたのHPが0になっても敗北！</li>
                  <li>• バランスを考えて攻撃しよう！</li>
                </>
              ) : (
                <>
                  <li>• Нанесите сопернику урон до 0 ментального HP, чтобы выиграть!</li>
                  <li>• <span className="text-red-400 font-bold">⚡ NEW!</span> Соперник тоже атакует в ответ! Ваш HP тоже уменьшается</li>
                  <li>• Чем сильнее оскорбление, тем больше урон, но и риск блокировки выше</li>
                  <li>• Если вас заблокировали, игра окончена</li>
                  <li>• Если ваш HP упал до 0, вы проиграли!</li>
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
