import React from 'react';

const LanguageSwitcher = ({ currentLanguage, onLanguageChange }) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm font-medium text-gray-600">言語:</span>
      <div className="flex rounded-lg overflow-hidden border border-gray-300">
        <button
          onClick={() => onLanguageChange('ja')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            currentLanguage === 'ja'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          🇯🇵 日本語
        </button>
        <button
          onClick={() => onLanguageChange('ru')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            currentLanguage === 'ru'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          🇷🇺 Русский
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;