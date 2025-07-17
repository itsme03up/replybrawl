// GaugeBar.jsx
// メンタルゲージUIの表示

import React from 'react';

const GaugeBar = ({ label, value, maxValue = 100, type = 'hp' }) => {
  const percentage = Math.max(0, (value / maxValue) * 100);
  
  const getBarColor = () => {
    if (type === 'hp') {
      if (percentage > 60) return 'bg-green-500';
      if (percentage > 30) return 'bg-yellow-500';
      return 'bg-red-500';
    } else if (type === 'block') {
      if (percentage > 70) return 'bg-red-500';
      if (percentage > 40) return 'bg-yellow-500';
      return 'bg-green-500';
    }
    return 'bg-blue-500';
  };

  const getGlowEffect = () => {
    if (type === 'hp' && percentage <= 20) {
      return 'animate-pulse shadow-lg shadow-red-500/50';
    }
    if (type === 'block' && percentage >= 80) {
      return 'animate-pulse shadow-lg shadow-red-500/50';
    }
    return '';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-300">{label}</span>
        <span className="text-xs font-bold text-white">
          {type === 'block' ? `${Math.round(percentage)}%` : `${value}/${maxValue}`}
        </span>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ease-out rounded-full ${getBarColor()} ${getGlowEffect()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* 危険状態の警告 */}
      {type === 'hp' && percentage <= 20 && (
        <div className="mt-1 text-xs text-red-400 animate-pulse">
          ⚠️ 危険状態！
        </div>
      )}
      
      {type === 'block' && percentage >= 80 && (
        <div className="mt-1 text-xs text-red-400 animate-pulse">
          🚨 ブロック危険！
        </div>
      )}
    </div>
  );
};

export default GaugeBar;
