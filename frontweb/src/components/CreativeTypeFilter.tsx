import React, { useState } from 'react';
import { CREATIVE_TYPES, CREATIVE_TYPE_CATEGORIES, CreativeTypeId, CreativeTypeCategory } from '../config/creativeTypes';

interface CreativeTypeFilterProps {
  onFilterChange: (selectedTypes: CreativeTypeId[]) => void;
  selectedTypes: CreativeTypeId[];
}

const CreativeTypeFilter: React.FC<CreativeTypeFilterProps> = ({ 
  onFilterChange, 
  selectedTypes 
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<CreativeTypeCategory>>(new Set());

  const toggleCategory = (category: CreativeTypeCategory) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleType = (typeId: CreativeTypeId) => {
    const newSelected = selectedTypes.includes(typeId)
      ? selectedTypes.filter(id => id !== typeId)
      : [...selectedTypes, typeId];
    onFilterChange(newSelected);
  };

  const clearAll = () => {
    onFilterChange([]);
  };

  // 按分类组织创意类型
  const typesByCategory = Object.entries(CREATIVE_TYPES).reduce((acc, [id, type]) => {
    const category = type.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push({ id: Number(id) as CreativeTypeId, ...type });
    return acc;
  }, {} as Record<CreativeTypeCategory, Array<{ id: CreativeTypeId } & typeof CREATIVE_TYPES[CreativeTypeId]>>);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative z-[3001]">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">创意类型</h3>
        {selectedTypes.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            清除全部
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-100">
        {Object.entries(CREATIVE_TYPE_CATEGORIES).map(([categoryKey, categoryInfo]) => {
          const category = categoryKey as CreativeTypeCategory;
          const types = typesByCategory[category] || [];
          const isExpanded = expandedCategories.has(category);
          const selectedInCategory = types.filter(type => selectedTypes.includes(type.id)).length;

          return (
            <div key={category}>
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 relative z-[3002]"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">{categoryInfo.icon}</span>
                  <span className="font-medium text-gray-800">{categoryInfo.name}</span>
                  {selectedInCategory > 0 && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {selectedInCategory}
                    </span>
                  )}
                </div>
                <svg 
                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>
              </div>

              {isExpanded && (
                <div className="bg-gray-50 px-4 py-2">
                  <div className="space-y-2">
                    {types.map((type) => (
                      <label
                        key={type.id}
                        className="flex items-center cursor-pointer hover:bg-gray-100 rounded p-2 relative z-[3003]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type.id)}
                          onChange={() => toggleType(type.id)}
                          className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500 relative z-[3004]"
                        />
                        <span className="text-base mr-2">{type.icon}</span>
                        <span className="text-sm text-gray-700">{type.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreativeTypeFilter;