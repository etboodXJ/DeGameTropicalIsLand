import React, { useState } from 'react';

const SimpleNavigation: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    console.log('点击了游戏专区');
    alert('点击了游戏专区');
    setExpanded(!expanded);
  };

  const testClick = () => {
    alert('测试按钮点击成功!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">分类导航</h2>
        <button 
          onClick={testClick}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          测试按钮
        </button>
      </div>
      
      <div className="divide-y divide-gray-100">
        {/* 创意想法 */}
        <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50">
          <span className="text-lg mr-3">💡</span>
          <span className="font-medium">创意想法</span>
        </div>

        {/* 游戏专区 */}
        <div>
          <div 
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
            onClick={handleClick}
            style={{ zIndex: 10, position: 'relative' }}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3">🎮</span>
              <span className="font-medium">游戏专区</span>
            </div>
            <svg
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
          
          {expanded && (
            <div className="bg-gray-50">
              <div className="flex items-center px-8 py-3 cursor-pointer hover:bg-gray-100">
                <span className="text-lg mr-3">🎮</span>
                <span className="font-medium">游戏项目</span>
              </div>
              <div className="flex items-center px-8 py-3 cursor-pointer hover:bg-gray-100">
                <span className="text-lg mr-3">🔧</span>
                <span className="font-medium">游戏原型</span>
              </div>
              <div className="flex items-center px-8 py-3 cursor-pointer hover:bg-gray-100">
                <span className="text-lg mr-3">📦</span>
                <span className="font-medium">游戏资源</span>
              </div>
            </div>
          )}
        </div>

        {/* 应用专区 */}
        <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50">
          <span className="text-lg mr-3">📱</span>
          <span className="font-medium">应用专区</span>
        </div>

        {/* 创意资源 */}
        <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50">
          <span className="text-lg mr-3">📦</span>
          <span className="font-medium">创意资源</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleNavigation;