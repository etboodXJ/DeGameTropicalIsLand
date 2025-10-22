// 创意内容JSON结构
export interface CreativeContent {
  text: string;
  background_image?: string;
  media?: string[];
  thumbnail?: string;
}

// 解析创意内容
export const parseCreativeContent = (content: string): CreativeContent => {
  try {
    const parsed = JSON.parse(content);
    return {
      text: parsed.text || content, // 兼容旧格式
      background_image: parsed.background_image || '',
      media: parsed.media || [],
      thumbnail: parsed.thumbnail || ''
    };
  } catch {
    // 如果不是JSON格式，当作纯文本处理
    return {
      text: content,
      background_image: '',
      media: [],
      thumbnail: ''
    };
  }
};

// 序列化创意内容
export const stringifyCreativeContent = (content: CreativeContent): string => {
  return JSON.stringify(content);
};

// 更新背景图片
export const updateBackgroundImage = (content: string, backgroundImage: string): string => {
  const parsed = parseCreativeContent(content);
  parsed.background_image = backgroundImage;
  return stringifyCreativeContent(parsed);
};