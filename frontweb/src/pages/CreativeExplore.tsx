import React, { useState, useEffect, useMemo } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import CreativeCard from '../components/CreativeCard';
import SimpleNavigation from '../components/SimpleNavigation';
import TestNav from '../components/TestNav';
import { filterCreatives, filterByCategory, searchCreatives, sortCreatives, Creative, FilterOptions } from '../utils/categoryUtils';
import { NAVIGATION_MENU } from '../config/categories';

interface CategorySelection {
  category?: string;
  tags?: string[];
}

const CreativeExplore: React.FC = () => {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategorySelection | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 模拟数据加载
  useEffect(() => {
    const loadCreatives = async () => {
      setLoading(true);
      // 模拟API调用
      const mockData: Creative[] = [
        {
          id: '1',
          title: '2D横版动作游戏原型',
          description: '使用Unity开发的2D横版动作游戏，包含角色移动、跳跃、攻击等基础功能',
          category: 'prototype',
          tags: ['game', 'unity', '2d', 'concept'],
          creator: '0x1234567890abcdef',
          created_at: 1640995200,
          total_expectation: 150,
          views: 89
        },
        {
          id: '2',
          title: 'AI生成的游戏角色动画',
          description: 'AI生成的游戏角色行走、跑步、攻击动画序列，可用于2D游戏开发',
          category: 'resource',
          tags: ['game', 'character', 'animation', 'ai'],
          creator: '0xabcdef1234567890',
          created_at: 1640908800,
          total_expectation: 200,
          views: 156
        },
        {
          id: '3',
          title: 'DeFi收益聚合器项目',
          description: '基于区块链的DeFi收益聚合器，帮助用户自动寻找最优收益策略',
          category: 'project',
          tags: ['creative', 'blockchain', 'development'],
          creator: '0x567890abcdef1234',
          created_at: 1640822400,
          total_expectation: 500,
          views: 234
        }
      ];
      
      setTimeout(() => {
        setCreatives(mockData);
        setLoading(false);
      }, 1000);
    };

    loadCreatives();
  }, []);

  // 筛选和搜索逻辑
  const filteredCreatives = useMemo(() => {
    let result = creatives;

    // 按分类筛选
    if (selectedCategory) {
      result = filterByCategory(result, selectedCategory.category, selectedCategory.tags);
    }

    // 按筛选条件筛选
    result = filterCreatives(result, filters);

    // 搜索
    result = searchCreatives(result, searchTerm);

    // 排序
    result = sortCreatives(result, sortBy, sortOrder);

    return result;
  }, [creatives, selectedCategory, filters, searchTerm, sortBy, sortOrder]);

  const handleCreativeClick = (creative: Creative) => {
    console.log('点击创意:', creative);
    // 这里应该导航到创意详情页
  };

  const handleCategorySelect = (category: CategorySelection | null) => {
    setSelectedCategory(category);
    setFilters({}); // 清除其他筛选条件
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setSelectedCategory(null); // 清除分类选择
  };

  // 导航菜单状态
  const [gameExpanded, setGameExpanded] = useState(true);
  const [appExpanded, setAppExpanded] = useState(true);

  // 导航菜单渲染
  const renderNavigationMenu = () => {
    return (
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden"
        style={{ pointerEvents: 'auto', position: 'relative', zIndex: 1000 }}
      >
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">分类导航</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {/* 创意想法 */}
          <div 
            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50"
            onClick={() => handleCategorySelect({ category: 'idea', tags: ['creative'] })}
          >
            <span className="text-lg mr-3">💡</span>
            <span className="font-medium">创意想法</span>
          </div>

          {/* 游戏专区 */}
          <div>
            <div 
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
              onClick={() => setGameExpanded(!gameExpanded)}
              style={{ pointerEvents: 'auto', position: 'relative', zIndex: 1001 }}
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">🎮</span>
                <span className="font-medium">游戏专区</span>
              </div>
              <svg className={`w-4 h-4 transition-transform ${gameExpanded ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
            {gameExpanded && (
              <div className="bg-gray-50">
                <div className="flex items-center px-8 py-3 cursor-pointer hover:bg-gray-100" onClick={() => handleCategorySelect({ category: 'project', tags: ['game'] })}>
                  <span className="text-lg mr-3">🎮</span>
                  <span className="font-medium">游戏项目</span>
                </div>
                <div className="flex items-center px-8 py-3 cursor-pointer hover:bg-gray-100" onClick={() => handleCategorySelect({ category: 'prototype', tags: ['game'] })}>
                  <span className="text-lg mr-3">🔧</span>
                  <span className="font-medium">游戏原型</span>
                </div>
                <div className="flex items-center px-8 py-3 cursor-pointer hover:bg-gray-100" onClick={() => handleCategorySelect({ category: 'resource', tags: ['game'] })}>
                  <span className="text-lg mr-3">📦</span>
                  <span className="font-medium">游戏资源</span>
                </div>
              </div>
            )}
          </div>

          {/* 应用专区 */}
          <div>
            <div 
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
              onClick={() => setAppExpanded(!appExpanded)}
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">📱</span>
                <span className="font-medium">应用专区</span>
              </div>
              <svg className={`w-4 h-4 transition-transform ${appExpanded ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
            {appExpanded && (
              <div className="bg-gray-50">
                <div className="flex items-center px-8 py-3 cursor-pointer hover:bg-gray-100" onClick={() => handleCategorySelect({ category: 'project', tags: ['app'] })}>
                  <span className="text-lg mr-3">📱</span>
                  <span className="font-medium">应用项目</span>
                </div>
                <div className="flex items-center px-8 py-3 cursor-pointer hover:bg-gray-100" onClick={() => handleCategorySelect({ category: 'prototype', tags: ['app'] })}>
                  <span className="text-lg mr-3">🔧</span>
                  <span className="font-medium">应用原型</span>
                </div>
              </div>
            )}
          </div>

          {/* 创意资源 */}
          <div 
            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50"
            onClick={() => handleCategorySelect({ category: 'resource', tags: ['creative'] })}
          >
            <span className="text-lg mr-3">📦</span>
            <span className="font-medium">创意资源</span>
          </div>
        </div>

        {/* 全部创意 */}
        <div className="border-t border-gray-200">
          <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50" onClick={() => handleCategorySelect(null)}>
            <span className="text-lg mr-3">🌟</span>
            <span className="font-medium">全部创意</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧导航 */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div style={{ display: 'none' }}><TestNav /></div>
              {renderNavigationMenu()}
              <CategoryFilter 
                onFilterChange={handleFilterChange}
                selectedFilters={filters}
              />
            </div>
          </div>

          {/* 主内容区 */}
          <div className="lg:col-span-3">
            {/* 搜索和排序栏 */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* 搜索框 */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="搜索创意、标题、描述..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                  </svg>
                </div>

                {/* 排序选择 */}
                <div className="flex items-center space-x-2">
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field);
                      setSortOrder(order as 'asc' | 'desc');
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="created_at-desc">最新发布</option>
                    <option value="created_at-asc">最早发布</option>
                    <option value="total_expectation-desc">期待值最高</option>
                    <option value="views-desc">浏览量最高</option>
                    <option value="title-asc">标题A-Z</option>
                  </select>
                </div>
              </div>

              {/* 结果统计 */}
              <div className="mt-4 text-sm text-gray-600">
                找到 <span className="font-medium text-gray-900">{filteredCreatives.length}</span> 个创意
                {selectedCategory && (
                  <span className="ml-2">
                    - 分类: <span className="font-medium">{selectedCategory.category}</span>
                  </span>
                )}
              </div>
            </div>

            {/* 创意列表 */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="flex space-x-2 mb-4">
                      <div className="h-6 w-16 bg-gray-200 rounded"></div>
                      <div className="h-6 w-12 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredCreatives.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCreatives.map((creative) => (
                  <CreativeCard
                    key={creative.id}
                    creative={creative}
                    onClick={handleCreativeClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"/>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到创意</h3>
                <p className="mt-1 text-sm text-gray-500">
                  尝试调整搜索条件或筛选器
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeExplore;