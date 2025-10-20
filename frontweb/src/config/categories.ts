// 创意分类配置
export const CATEGORIES = {
  // 主分类 (按成熟度)
  MAIN: {
    IDEA: 'idea',           // 创意想法
    PROTOTYPE: 'prototype', // 原型demo
    PROJECT: 'project',     // 完整项目
    RESOURCE: 'resource'    // 资源素材
  },
  
  // 领域标签
  DOMAINS: {
    GAME: 'game',
    APP: 'app', 
    CREATIVE: 'creative',
    HARDWARE: 'hardware',
    ART: 'art',
    DESIGN: 'design'
  },
  
  // 技术标签
  TECH: {
    AI: 'ai',
    BLOCKCHAIN: 'blockchain',
    VR: 'vr',
    AR: 'ar',
    MOBILE: 'mobile',
    WEB: 'web',
    UNITY: 'unity'
  },
  
  // 状态标签
  STATUS: {
    CONCEPT: 'concept',
    DEVELOPMENT: 'development',
    TESTING: 'testing',
    RELEASED: 'released',
    MAINTAINED: 'maintained'
  },
  
  // 类型标签
  TYPES: {
    '2D': '2d',
    '3D': '3d',
    ANIMATION: 'animation',
    SOUND: 'sound',
    UI: 'ui',
    CHARACTER: 'character',
    SCENE: 'scene'
  }
} as const;

// 分类显示配置
export const CATEGORY_DISPLAY = {
  [CATEGORIES.MAIN.IDEA]: {
    name: '创意想法',
    icon: '💡',
    color: '#FFD700',
    description: '概念和想法阶段'
  },
  [CATEGORIES.MAIN.PROTOTYPE]: {
    name: '原型Demo',
    icon: '🔧',
    color: '#FF6B6B',
    description: '可演示的原型'
  },
  [CATEGORIES.MAIN.PROJECT]: {
    name: '完整项目',
    icon: '🚀',
    color: '#4ECDC4',
    description: '完整的项目方案'
  },
  [CATEGORIES.MAIN.RESOURCE]: {
    name: '创意资源',
    icon: '📦',
    color: '#45B7D1',
    description: '素材和资源'
  }
};

// 标签显示配置
export const TAG_DISPLAY: Record<string, { name: string; color: string }> = {
  // 领域标签
  [CATEGORIES.DOMAINS.GAME]: { name: '游戏', color: '#E74C3C' },
  [CATEGORIES.DOMAINS.APP]: { name: '应用', color: '#3498DB' },
  [CATEGORIES.DOMAINS.CREATIVE]: { name: '创意', color: '#9B59B6' },
  [CATEGORIES.DOMAINS.HARDWARE]: { name: '硬件', color: '#E67E22' },
  [CATEGORIES.DOMAINS.ART]: { name: '艺术', color: '#F39C12' },
  [CATEGORIES.DOMAINS.DESIGN]: { name: '设计', color: '#1ABC9C' },
  
  // 技术标签
  [CATEGORIES.TECH.AI]: { name: 'AI', color: '#8E44AD' },
  [CATEGORIES.TECH.BLOCKCHAIN]: { name: '区块链', color: '#2C3E50' },
  [CATEGORIES.TECH.VR]: { name: 'VR', color: '#E74C3C' },
  [CATEGORIES.TECH.AR]: { name: 'AR', color: '#F39C12' },
  [CATEGORIES.TECH.MOBILE]: { name: '移动端', color: '#27AE60' },
  [CATEGORIES.TECH.WEB]: { name: 'Web', color: '#3498DB' },
  [CATEGORIES.TECH.UNITY]: { name: 'Unity', color: '#34495E' },
  
  // 状态标签
  [CATEGORIES.STATUS.CONCEPT]: { name: '概念', color: '#95A5A6' },
  [CATEGORIES.STATUS.DEVELOPMENT]: { name: '开发中', color: '#F39C12' },
  [CATEGORIES.STATUS.TESTING]: { name: '测试', color: '#E67E22' },
  [CATEGORIES.STATUS.RELEASED]: { name: '已发布', color: '#27AE60' },
  [CATEGORIES.STATUS.MAINTAINED]: { name: '维护中', color: '#2980B9' },
  
  // 类型标签
  [CATEGORIES.TYPES['2D']]: { name: '2D', color: '#16A085' },
  [CATEGORIES.TYPES['3D']]: { name: '3D', color: '#8E44AD' },
  [CATEGORIES.TYPES.ANIMATION]: { name: '动画', color: '#E91E63' },
  [CATEGORIES.TYPES.SOUND]: { name: '音效', color: '#FF5722' },
  [CATEGORIES.TYPES.UI]: { name: 'UI', color: '#607D8B' },
  [CATEGORIES.TYPES.CHARACTER]: { name: '角色', color: '#795548' },
  [CATEGORIES.TYPES.SCENE]: { name: '场景', color: '#4CAF50' }
};

// 导航菜单配置
export const NAVIGATION_MENU = [
  {
    key: 'ideas',
    title: '创意想法',
    category: CATEGORIES.MAIN.IDEA,
    tags: [CATEGORIES.DOMAINS.CREATIVE],
    icon: '💡'
  },
  {
    key: 'games',
    title: '游戏专区',
    icon: '🎮',
    children: [
      {
        key: 'game-projects',
        title: '游戏项目',
        category: CATEGORIES.MAIN.PROJECT,
        tags: [CATEGORIES.DOMAINS.GAME],
        icon: '🎮'
      },
      {
        key: 'game-prototypes',
        title: '游戏原型',
        category: CATEGORIES.MAIN.PROTOTYPE,
        tags: [CATEGORIES.DOMAINS.GAME],
        icon: '🔧'
      },
      {
        key: 'game-resources',
        title: '游戏资源',
        category: CATEGORIES.MAIN.RESOURCE,
        tags: [CATEGORIES.DOMAINS.GAME],
        icon: '📦'
      }
    ]
  },
  {
    key: 'apps',
    title: '应用专区',
    icon: '📱',
    children: [
      {
        key: 'app-projects',
        title: '应用项目',
        category: CATEGORIES.MAIN.PROJECT,
        tags: [CATEGORIES.DOMAINS.APP],
        icon: '📱'
      },
      {
        key: 'app-prototypes',
        title: '应用原型',
        category: CATEGORIES.MAIN.PROTOTYPE,
        tags: [CATEGORIES.DOMAINS.APP],
        icon: '🔧'
      }
    ]
  },
  {
    key: 'resources',
    title: '创意资源',
    category: CATEGORIES.MAIN.RESOURCE,
    tags: [CATEGORIES.DOMAINS.CREATIVE],
    icon: '📦'
  }
];

// 筛选器配置
export const FILTER_CONFIG = {
  maturity: {
    title: '成熟度',
    options: [
      { value: CATEGORIES.MAIN.IDEA, label: '想法' },
      { value: CATEGORIES.MAIN.PROTOTYPE, label: '原型' },
      { value: CATEGORIES.MAIN.PROJECT, label: '项目' },
      { value: CATEGORIES.MAIN.RESOURCE, label: '资源' }
    ]
  },
  domain: {
    title: '领域',
    options: [
      { value: CATEGORIES.DOMAINS.GAME, label: '游戏' },
      { value: CATEGORIES.DOMAINS.APP, label: '应用' },
      { value: CATEGORIES.DOMAINS.CREATIVE, label: '创意' },
      { value: CATEGORIES.DOMAINS.HARDWARE, label: '硬件' }
    ]
  },
  tech: {
    title: '技术',
    options: [
      { value: CATEGORIES.TECH.AI, label: 'AI' },
      { value: CATEGORIES.TECH.BLOCKCHAIN, label: '区块链' },
      { value: CATEGORIES.TECH.VR, label: 'VR' },
      { value: CATEGORIES.TECH.MOBILE, label: '移动端' }
    ]
  },
  status: {
    title: '状态',
    options: [
      { value: CATEGORIES.STATUS.CONCEPT, label: '概念' },
      { value: CATEGORIES.STATUS.DEVELOPMENT, label: '开发中' },
      { value: CATEGORIES.STATUS.TESTING, label: '测试' },
      { value: CATEGORIES.STATUS.RELEASED, label: '已发布' }
    ]
  }
};