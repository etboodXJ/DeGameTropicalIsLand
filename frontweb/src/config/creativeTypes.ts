// 创意类型配置
export const CREATIVE_TYPES = {
  // 数字内容类
  0: { name: '图文创意', icon: '📝', category: 'digital' },
  1: { name: '视频创意', icon: '🎬', category: 'digital' },
  2: { name: '小说', icon: '📚', category: 'digital' },
  
  // 项目类
  3: { name: '产品众筹', icon: '💰', category: 'project' },
  4: { name: 'DAPP软件', icon: '⚡', category: 'project' },
  5: { name: '游戏', icon: '🎮', category: 'project' },
  6: { name: '移动应用', icon: '📱', category: 'project' },
  7: { name: '网站', icon: '🌐', category: 'project' },
  
  // 实体类
  8: { name: '实体店', icon: '🏪', category: 'physical' },
  
  // 活动类
  9: { name: '线下活动', icon: '🎪', category: 'event' },
  10: { name: '线下展览', icon: '🖼️', category: 'event' },
  11: { name: '线下演出', icon: '🎭', category: 'event' },
  12: { name: '线下讲座', icon: '🎤', category: 'event' },
  13: { name: '线下培训', icon: '📖', category: 'event' },
  14: { name: '线下比赛', icon: '🏆', category: 'event' },
  15: { name: '线下聚会', icon: '🎉', category: 'event' }
} as const;

export const CREATIVE_TYPE_CATEGORIES = {
  digital: { name: '数字内容', icon: '💻', color: '#3B82F6' },
  project: { name: '项目开发', icon: '🚀', color: '#8B5CF6' },
  physical: { name: '实体业务', icon: '🏢', color: '#10B981' },
  event: { name: '活动策划', icon: '🎪', color: '#F59E0B' }
} as const;

export type CreativeTypeId = keyof typeof CREATIVE_TYPES;
export type CreativeTypeCategory = keyof typeof CREATIVE_TYPE_CATEGORIES;