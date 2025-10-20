import React, { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CATEGORIES, CATEGORY_DISPLAY, TAG_DISPLAY } from '../config/categories';
import { useNetworkAwareConfig } from '../hooks/useNetworkAwareConfig';

interface CreativeSubmitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  creativeType: number;
}

const CreativeSubmitForm: React.FC<CreativeSubmitFormProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    content: '',
    category: '',
    tags: [],
    creativeType: 0
  });
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { packageId } = useNetworkAwareConfig();

  // 创意类型映射
  const creativeTypes = [
    { value: 0, label: '图文创意', description: '包含图片和文字的创意内容' },
    { value: 1, label: '视频创意', description: '视频形式的创意展示' },
    { value: 2, label: '小说', description: '文字创作和故事' },
    { value: 3, label: '产品众筹', description: '产品创意和众筹方案' },
    { value: 4, label: 'DAPP软件', description: '去中心化应用程序' },
    { value: 5, label: '游戏', description: '游戏创意和设计' },
    { value: 6, label: '移动应用', description: '手机APP创意' },
    { value: 7, label: '网站', description: '网站设计和开发' },
    { value: 8, label: '实体店', description: '实体商店创意' },
    { value: 9, label: '线下活动', description: '线下活动策划' },
    { value: 10, label: '线下展览', description: '展览活动创意' },
    { value: 11, label: '线下演出', description: '演出活动策划' },
    { value: 12, label: '线下讲座', description: '讲座活动组织' },
    { value: 13, label: '线下培训', description: '培训课程设计' },
    { value: 14, label: '线下比赛', description: '竞赛活动策划' },
    { value: 15, label: '线下聚会', description: '聚会活动组织' }
  ];

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag) {
        handleAddTag(tag);
        setTagInput('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentAccount) {
      alert('请先连接钱包');
      return;
    }

    if (!packageId) {
      alert('合约未部署，请先部署智能合约');
      return;
    }

    // 表单验证
    if (!formData.title.trim()) {
      alert('请输入创意标题');
      return;
    }
    if (!formData.description.trim()) {
      alert('请输入创意描述');
      return;
    }
    if (!formData.category) {
      alert('请选择创意分类');
      return;
    }

    setLoading(true);
    try {
      const tx = new Transaction();
      
      // 调用智能合约的 submit_creative_to_shared 函数
      tx.moveCall({
        target: `${packageId}::creative::submit_creative_to_shared`,
        arguments: [
          tx.pure.string(formData.title),
          tx.pure.string(formData.description),
          tx.pure.string(formData.content || ''),
          tx.pure.u8(formData.creativeType),
          tx.pure.string(formData.category),
          tx.pure.vector('string', formData.tags),
        ],
      });

      const result = await signAndExecute({ transaction: tx });
      
      console.log('创意提交成功:', result);
      alert('创意提交成功！等待审核。');
      
      // 重置表单
      setFormData({
        title: '',
        description: '',
        content: '',
        category: '',
        tags: [],
        creativeType: 0
      });
      setTagInput('');
      
      onSuccess?.();
      onClose();
      
    } catch (error) {
      console.error('提交创意失败:', error);
      alert(`提交创意失败: ${error instanceof Error ? error.message : '请重试'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700/30">
        <div className="sticky top-0 bg-gray-900/80 backdrop-blur-sm p-6 border-b border-gray-700/30">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-white">创意提交表单</h3>
            <button 
              className="text-gray-400 hover:text-white transition-colors"
              onClick={onClose}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 创意标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              创意标题 <span className="text-red-400">*</span>
            </label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-gray-400"
              placeholder="请输入创意标题"
              maxLength={100}
              required
            />
            <div className="text-xs text-gray-500 mt-1">{formData.title.length}/100</div>
          </div>

          {/* 创意类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              创意类型 <span className="text-red-400">*</span>
            </label>
            <select 
              value={formData.creativeType}
              onChange={(e) => handleInputChange('creativeType', parseInt(e.target.value))}
              className="w-full p-3 rounded-lg bg-white/10 border border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white"
              required
            >
              {creativeTypes.map(type => (
                <option key={type.value} value={type.value} className="bg-gray-800">
                  {type.label} - {type.description}
                </option>
              ))}
            </select>
          </div>

          {/* 创意分类 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              创意分类 <span className="text-red-400">*</span>
            </label>
            <select 
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white"
              required
            >
              <option value="" className="bg-gray-800">请选择创意分类</option>
              {Object.entries(CATEGORY_DISPLAY).map(([key, config]) => (
                <option key={key} value={key} className="bg-gray-800">
                  {config.icon} {config.name} - {config.description}
                </option>
              ))}
            </select>
          </div>

          {/* 创意描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              创意描述 <span className="text-red-400">*</span>
            </label>
            <textarea 
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-gray-400"
              rows={4}
              placeholder="请详细描述您的创意..."
              maxLength={500}
              required
            />
            <div className="text-xs text-gray-500 mt-1">{formData.description.length}/500</div>
          </div>

          {/* 创意内容 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              详细内容 (可选)
            </label>
            <textarea 
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-gray-400"
              rows={6}
              placeholder="请输入创意的详细内容、实现方案等..."
              maxLength={2000}
            />
            <div className="text-xs text-gray-500 mt-1">{formData.content.length}/2000</div>
          </div>

          {/* 标签 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              标签
            </label>
            <div className="space-y-3">
              {/* 快速标签选择 */}
              <div>
                <div className="text-xs text-gray-400 mb-2">快速选择:</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(TAG_DISPLAY).slice(0, 12).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleAddTag(key)}
                      className={`px-3 py-1 rounded-full text-xs transition-all ${
                        formData.tags.includes(key)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {config.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 自定义标签输入 */}
              <div>
                <input 
                  type="text" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyPress}
                  className="w-full p-3 rounded-lg bg-white/10 border border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="输入自定义标签，按回车或逗号添加"
                />
              </div>
              
              {/* 已选标签 */}
              {formData.tags.length > 0 && (
                <div>
                  <div className="text-xs text-gray-400 mb-2">已选标签:</div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      >
                        {TAG_DISPLAY[tag]?.name || tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-blue-300 hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700/30">
            <button 
              type="button"
              className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
              onClick={onClose}
            >
              取消
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !currentAccount}
            >
              {loading ? '提交中...' : '提交创意'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreativeSubmitForm;