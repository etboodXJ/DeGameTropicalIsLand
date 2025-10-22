import { CATEGORIES } from '../config/categories';

export interface Creative {
  id: string;
  title: string;
  description: string;
  content?: string;
  category: string;
  tags: string[];
  creator: string;
  created_at: number;
  total_expectation: number;
  views: number;
  status?: number;
  creative_type?: number;
}

export interface FilterOptions {
  maturity?: string[];
  domain?: string[];
  tech?: string[];
  status?: string[];
}

/**
 * 筛选创意列表
 */
export const filterCreatives = (creatives: Creative[], filters: FilterOptions): Creative[] => {
  if (!creatives || creatives.length === 0) return [];
  if (!filters || Object.keys(filters).length === 0) return creatives;

  return creatives.filter(creative => {
    // 成熟度筛选
    if (filters.maturity && filters.maturity.length > 0) {
      if (!filters.maturity.includes(creative.category)) {
        return false;
      }
    }

    // 领域筛选
    if (filters.domain && filters.domain.length > 0) {
      const hasMatchingDomain = filters.domain.some(domain => 
        creative.tags && creative.tags.includes(domain)
      );
      if (!hasMatchingDomain) {
        return false;
      }
    }

    // 技术筛选
    if (filters.tech && filters.tech.length > 0) {
      const hasMatchingTech = filters.tech.some(tech => 
        creative.tags && creative.tags.includes(tech)
      );
      if (!hasMatchingTech) {
        return false;
      }
    }

    // 状态筛选 - 基于创意的实际状态
    if (filters.status && filters.status.length > 0) {
      // 将状态值映射到数字
      const statusMap: { [key: string]: number } = {
        'concept': 0,
        'development': 1,
        'testing': 2,
        'released': 3,
        'maintained': 4
      };
      
      const hasMatchingStatus = filters.status.some(status => {
        const statusValue = statusMap[status];
        return statusValue !== undefined && creative.status === statusValue;
      });
      
      if (!hasMatchingStatus) {
        return false;
      }
    }

    return true;
  });
};

/**
 * 按分类和标签筛选创意
 */
export const filterByCategory = (creatives: Creative[], category?: string, tags: string[] = []): Creative[] => {
  if (!creatives || creatives.length === 0) return [];

  return creatives.filter(creative => {
    // 分类匹配
    if (category && creative.category !== category) {
      return false;
    }

    // 标签匹配 (OR逻辑)
    if (tags && tags.length > 0) {
      const hasMatchingTag = tags.some(tag => 
        creative.tags && creative.tags.includes(tag)
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    return true;
  });
};

/**
 * 搜索创意
 */
export const searchCreatives = (creatives: Creative[], searchTerm: string): Creative[] => {
  if (!creatives || creatives.length === 0) return [];
  if (!searchTerm || searchTerm.trim() === '') return creatives;

  const term = searchTerm.toLowerCase().trim();

  return creatives.filter(creative => {
    // 标题匹配
    if (creative.title && creative.title.toLowerCase().includes(term)) {
      return true;
    }

    // 描述匹配
    if (creative.description && creative.description.toLowerCase().includes(term)) {
      return true;
    }

    // 标签匹配
    if (creative.tags && creative.tags.some(tag => tag.toLowerCase().includes(term))) {
      return true;
    }

    return false;
  });
};

/**
 * 排序创意列表
 */
export const sortCreatives = (creatives: Creative[], sortBy: string = 'created_at', order: 'asc' | 'desc' = 'desc'): Creative[] => {
  if (!creatives || creatives.length === 0) return [];

  return [...creatives].sort((a, b) => {
    let aValue = (a as any)[sortBy];
    let bValue = (b as any)[sortBy];

    // 处理不同数据类型
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (order === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

/**
 * 检查分类是否有效
 */
export const isValidCategory = (category: string): boolean => {
  return Object.values(CATEGORIES.MAIN).includes(category as any);
};