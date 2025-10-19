import { Button, DropdownMenu, Text } from '@radix-ui/themes';
import { GlobeIcon } from '@radix-ui/react-icons';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { key: 'zh', label: t('language.chinese'), flag: '🇨🇳' },
    { key: 'en', label: t('language.english'), flag: '🇺🇸' }
  ];

  const currentLang = languages.find(lang => lang.key === language);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button 
          variant="outline" 
          size="2"
          style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white'
          }}
        >
          <GlobeIcon />
          <Text size="2">{currentLang?.flag} {currentLang?.label}</Text>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content 
        style={{ 
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {languages.map((lang) => (
          <DropdownMenu.Item
            key={lang.key}
            onClick={() => setLanguage(lang.key as 'zh' | 'en')}
            style={{
              color: language === lang.key ? '#10B981' : 'white',
              cursor: 'pointer'
            }}
          >
            <Text size="2">{lang.flag} {lang.label}</Text>
            {language === lang.key && <Text size="1" style={{ color: '#10B981' }}>✓</Text>}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default LanguageSelector;