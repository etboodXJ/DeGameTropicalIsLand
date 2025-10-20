import React, { useState } from 'react';
import { FILTER_CONFIG } from '../config/categories';
import { FilterOptions } from '../utils/categoryUtils';

interface CategoryFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  selectedFilters?: FilterOptions;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onFilterChange, selectedFilters = {} }) => {
  const [activeTab, setActiveTab] = useState('maturity');

  const handleFilterChange = (filterType: keyof FilterOptions, value: string, checked: boolean) => {
    const currentFilters = selectedFilters[filterType] || [];
    let newFilters: string[];
    
    if (checked) {
      newFilters = [...currentFilters, value];
    } else {
      newFilters = currentFilters.filter(item => item !== value);
    }
    
    onFilterChange({
      ...selectedFilters,
      [filterType]: newFilters
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const getSelectedCount = () => {
    return Object.values(selectedFilters).reduce((total, filters) => total + (filters?.length || 0), 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">筛选条件</h3>
        {getSelectedCount() > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            清除全部 ({getSelectedCount()})
          </button>
        )}
      </div>

      {/* 标签页 */}
      <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
        {Object.entries(FILTER_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {config.title}
          </button>
        ))}
      </div>

      {/* 筛选选项 */}
      <div className="space-y-3">
        {FILTER_CONFIG[activeTab as keyof typeof FILTER_CONFIG]?.options.map((option) => {
          const isSelected = selectedFilters[activeTab as keyof FilterOptions]?.includes(option.value) || false;
          
          return (
            <label
              key={option.value}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => handleFilterChange(activeTab as keyof FilterOptions, option.value, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
              {isSelected && (
                <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  已选
                </span>
              )}
            </label>
          );
        })}
      </div>

      {/* 已选择的筛选条件预览 */}
      {getSelectedCount() > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">已选择的条件:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([filterType, values]) =>
              values?.map((value) => {
                const config = FILTER_CONFIG[filterType as keyof typeof FILTER_CONFIG];
                const option = config?.options.find(opt => opt.value === value);
                
                return (
                  <span
                    key={`${filterType}-${value}`}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                  >
                    {config?.title}: {option?.label}
                    <button
                      onClick={() => handleFilterChange(filterType as keyof FilterOptions, value, false)}
                      className="ml-1 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;