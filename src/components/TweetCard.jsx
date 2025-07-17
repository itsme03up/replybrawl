// TweetCard.jsx
// 表示用コンポーネント。相手のプロフィール画像・名前・セリフをTwitter風に表示。

import React from 'react';

const TweetCard = ({ username = "レスバ太郎", handle = "@resbatarou", text, profileImage }) => {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-2 sm:p-3 max-w-2xl mx-auto">
      <div className="flex space-x-2">
        {/* プロフィール画像 */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
            {profileImage || username.charAt(0)}
          </div>
        </div>
        
        {/* ツイート内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <h3 className="text-white font-bold truncate text-xs sm:text-sm">{username}</h3>
            <span className="text-gray-400 text-xs truncate">{handle}</span>
            <span className="text-gray-400 text-xs">·</span>
            <span className="text-gray-400 text-xs">今</span>
          </div>
          
          <div className="mt-1">
            <p className="text-white text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
              {text}
            </p>
          </div>
          
          {/* Twitter風アクションボタン */}
          <div className="flex items-center mt-2 space-x-3 sm:space-x-4 text-gray-400">
            <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-xs">返信</span>
            </button>
            
            <button className="flex items-center space-x-1 hover:text-green-400 transition-colors">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-xs hidden sm:inline">RT</span>
            </button>
            
            <button className="flex items-center space-x-1 hover:text-red-400 transition-colors">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-xs">♡</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
              </svg>
              <span className="text-xs sm:text-sm">いいね</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
