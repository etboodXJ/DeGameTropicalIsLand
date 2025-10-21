import React, { useState, useEffect, useMemo } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import CreativeCard from '../components/CreativeCard';
import CreativeTypeFilter from '../components/CreativeTypeFilter';
import SimpleNavigation from '../components/SimpleNavigation';
import TestNav from '../components/TestNav';
import Navbar from '../components/Navbar';
import { CreativeTypeId } from '../config/creativeTypes';
import { filterCreatives, filterByCategory, searchCreatives, sortCreatives, Creative, FilterOptions } from '../utils/categoryUtils';
import { NAVIGATION_MENU } from '../config/categories';
import { useSuiClient } from '@mysten/dapp-kit';
import { useNetworkAwareConfig } from '../hooks/useNetworkAwareConfig';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface CategorySelection {
  category?: string;
  tags?: string[];
}

const CreativeExplore: React.FC = () => {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategorySelection | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedTypes, setSelectedTypes] = useState<CreativeTypeId[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const suiClient = useSuiClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { packageId, isContractDeployed } = useNetworkAwareConfig();

  // 从 URL 参数获取搜索词
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  // 模拟数据加载
  useEffect(() => {
    const loadCreatives = async () => {
      setLoading(true);
      // 模拟API调用
      if (!isContractDeployed || !packageId) {
        setLoading(false);
        return;
      }

      try {
        const events = await suiClient.queryEvents({
          query: {
            MoveEventType: `${packageId}::creative::CreativeSubmitted`
          },
          limit: 50,
          order: 'descending'
        });

        const creativesData: Creative[] = [];
        
        for (const event of events.data) {
          if (event.parsedJson) {
            const data = event.parsedJson as any;
            
            creativesData.push({
              id: data.creative_id,
              title: data.title,
              description: data.description,
              category: data.category,
              tags: data.tags || [],
              creator: data.creator,
              created_at: parseInt(data.created_at),
              total_expectation: 0,
              views: 0,
              creative_type: data.creative_type !== undefined ? parseInt(data.creative_type) : 0
            });
          }
        }
        
        setCreatives(creativesData);
      } catch (error) {
        console.error('加载创意失败:', error);
        setCreatives([]);
      } finally {
        setLoading(false);
      }
    };

    loadCreatives();
  }, [packageId, isContractDeployed]);

  // 筛选和搜索逻辑
  const filteredCreatives = useMemo(() => {
    let result = creatives;

    // 按分类筛选
    if (selectedCategory) {
      result = filterByCategory(result, selectedCategory.category, selectedCategory.tags);
    }

    // 按筛选条件筛选
    result = filterCreatives(result, filters);

    // 按创意类型筛选
    if (selectedTypes.length > 0) {
      result = result.filter(creative => 
        creative.creative_type !== undefined && 
        selectedTypes.includes(creative.creative_type as CreativeTypeId)
      );
    }

    // 搜索
    result = searchCreatives(result, searchTerm);

    // 排序
    result = sortCreatives(result, sortBy, sortOrder);

    return result;
  }, [creatives, selectedCategory, filters, selectedTypes, searchTerm, sortBy, sortOrder]);

  const handleCreativeClick = (creative: Creative) => {
    navigate(`/creative/${creative.id}`);
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
            onClick={() => handleCategorySelect({ category: 'idea' })}
          >
            <span className="text-lg mr-3">💡</span>
            <span className="font-medium">创意想法</span>
          </div>

          {/* 原型Demo */}
          <div 
            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50"
            onClick={() => handleCategorySelect({ category: 'prototype' })}
          >
            <span className="text-lg mr-3">🔧</span>
            <span className="font-medium">原型Demo</span>
          </div>

          {/* 完整项目 */}
          <div 
            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50"
            onClick={() => handleCategorySelect({ category: 'project' })}
          >
            <span className="text-lg mr-3">🚀</span>
            <span className="font-medium">完整项目</span>
          </div>

          {/* 创意资源 */}
          <div 
            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50"
            onClick={() => handleCategorySelect({ category: 'resource' })}
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
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧导航 */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div style={{ display: 'none' }}><TestNav /></div>
              {renderNavigationMenu()}
              <CreativeTypeFilter 
                onFilterChange={setSelectedTypes}
                selectedTypes={selectedTypes}
              />
              <CategoryFilter 
                onFilterChange={handleFilterChange}
                selectedFilters={filters}
              />
            </div>
          </div>

          {/* 主内容区 */}
          <div className="lg:col-span-3">
            {/* 搜索和排序栏 */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 relative z-[3001]">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* 搜索框 */}
                <div className="flex-1 relative">
                  <form onSubmit={(e) => { e.preventDefault(); /* 搜索已经通过 useMemo 实时触发 */ }}>
                    <input
                      type="text"
                      placeholder="搜索创意、标题、描述..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent relative z-[3002]"
                    />
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                    </svg>
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </form>
                </div>

                {/* 排序选择 */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">排序：</label>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field);
                      setSortOrder(order as 'asc' | 'desc');
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white relative z-[3002]"
                  >
                    <option value="created_at-desc">最新发布</option>
                    <option value="created_at-asc">最早发布</option>
                    <option value="total_expectation-desc">热门程度（按投票数）</option>
                    <option value="title-asc">标题字母顺序</option>
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