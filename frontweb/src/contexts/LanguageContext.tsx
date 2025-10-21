import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  zh: {
    'nav.title': '创意空间',
    'nav.subtitle': '创意去中心化交易平台',
    'nav.home': '首页',
    'nav.market': '资源市场',
    'nav.assets': '我的资产',
    'nav.points': '积分中心',
    'network.mainnet': '主网',
    'network.testnet': '测试网',
    'network.switched': '已切换到 {network} 网络',
    'wallet.balance': '{amount} SUI',
    'points.balance': '{amount} CYKJ',
    'points.title': '积分中心',
    'points.myPoints': '我的积分',
    'language.chinese': '中文',
    'language.english': 'English'
  },
  en: {
    'nav.title': 'SparkSpace',
    'nav.subtitle': 'Decentralized Creative Trading Platform',
    'nav.home': 'Home',
    'nav.market': 'Market',
    'nav.assets': 'My Assets',
    'nav.points': 'Points Center',
    'network.mainnet': 'Mainnet',
    'network.testnet': 'Testnet',
    'network.switched': 'Switched to {network} network',
    'wallet.balance': '{amount} SUI',
    'points.balance': '{amount} CYKJ',
    'points.title': 'Points Center',
    'points.myPoints': 'My Points',
    'language.chinese': '中文',
    'language.english': 'English'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string, params?: Record<string, string>) => {
    let text = translations[language][key as keyof typeof translations[typeof language]] || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, value);
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};