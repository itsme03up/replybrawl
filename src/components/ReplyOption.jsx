// ReplyOption.jsx
// 悪口ボタン選択肢の表示とクリック処理

import React from 'react';

const ReplyOption = ({ badword, onSelect, disabled = false }) => {
  const getDamageColor = (damage) => {
    if (damage >= 30) return 'border-red-500 bg-red-900/20 hover:bg-red-800/30';
    if (damage >= 20) return 'border-yellow-500 bg-yellow-900/20 hover:bg-yellow-800/30';
    return 'border-green-500 bg-green-900/20 hover:bg-green-800/30';
  };

  const getDamageLabel = (damage) => {
    if (damage >= 30) return '💀 重';
    if (damage >= 20) return '⚡ 中';
    return '💧 軽';
  };

  return (
    <button
      onClick={() => onSelect(badword)}
      disabled={disabled}
      className={`
        w-full p-2 sm:p-3 rounded border-2 transition-all duration-200 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${getDamageColor(badword.damage)}
        disabled:hover:bg-opacity-20
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 text-left min-w-0">
          <p className="text-white font-medium text-sm sm:text-base mb-1 truncate">
            {badword.word}
          </p>
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs">
            <span className="text-gray-300">
              ダメージ: {badword.damage}
            </span>
            <span className="text-gray-300">
              ブロック率: {Math.round(badword.block_risk * 100)}%
            </span>
          </div>
        </div>
        
        <div className="flex-shrink-0 ml-2">
          <span className="text-lg sm:text-xl">
            {getDamageLabel(badword.damage)}
          </span>
        </div>
      </div>
      
      {/* 危険度インジケーター */}
      <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            badword.damage >= 30 ? 'bg-red-500' :
            badword.damage >= 20 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${Math.min(100, (badword.damage / 30) * 100)}%` }}
        />
      </div>
    </button>
  );
};

export default ReplyOption;
