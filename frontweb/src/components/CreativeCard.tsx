import React from 'react';
import { CATEGORY_DISPLAY, TAG_DISPLAY } from '../config/categories';
import { Creative } from '../utils/categoryUtils';

interface CreativeCardProps {
  creative: Creative;
  onClick: (creative: Creative) => void;
}

const CreativeCard: React.FC<CreativeCardProps> = ({ creative, onClick }) => {
  const categoryInfo = CATEGORY_DISPLAY[creative.category as keyof typeof CATEGORY_DISPLAY];
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('zh-CN');
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
      onClick={() => onClick(creative)}
    >
      {/* 头部 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
              {creative.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {truncateText(creative.description)}
            </p>
          </div>
          
          {/* 分类标识 */}
          <div className="ml-4 flex-shrink-0">
            <span 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: categoryInfo?.color + '20',
                color: categoryInfo?.color 
              }}
            >
              <span className="mr-1">{categoryInfo?.icon}</span>
              {categoryInfo?.name}
            </span>
          </div>
        </div>
      </div>

      {/* 标签区域 */}
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {creative.tags?.slice(0, 4).map((tag, index) => {
            const tagInfo = TAG_DISPLAY[tag];
            return (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs"
                style={{
                  backgroundColor: tagInfo?.color + '15',
                  color: tagInfo?.color || '#666'
                }}
              >
                {tagInfo?.name || tag}
              </span>
            );
          })}
          {creative.tags?.length > 4 && (
            <span className="text-xs text-gray-500">
              +{creative.tags.length - 4}
            </span>
          )}
        </div>

        {/* 统计信息 */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
              {creative.views || 0}
            </span>
            
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
              </svg>
              {creative.total_expectation || 0}
            </span>
          </div>
          
          <span>{formatDate(creative.created_at)}</span>
        </div>

        {/* 创作者信息 */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {creative.creator?.slice(0, 2) || 'U'}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {creative.creator?.slice(0, 8)}...{creative.creator?.slice(-6)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeCard;