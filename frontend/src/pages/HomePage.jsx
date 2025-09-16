import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { ConnectModal, useCurrentAccount, useSignAndExecuteTransactionBlock, useSuiClientQuery } from '@mysten/dapp-kit';

// 合约相关配置
const CONTRACT_PACKAGE_ID = '0x...'; // 需要替换为实际的合约包ID（部署合约后获取）
const CREATIVE_MODULE = 'creative';
const CREATIVE_FUNCTION = 'create_creative';

const HomePage = () => {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // 使用 dapp-kit hooks
  const currentAccount = useCurrentAccount();
  const signAndExecuteTransactionBlock = useSignAndExecuteTransactionBlock();
  const suiClient = useSuiClientQuery();

  // 部署合约后，请将 CONTRACT_PACKAGE_ID 替换为实际的包ID
  // 例如：const CONTRACT_PACKAGE_ID = '0x123...';

  // 提交创意到智能合约
  const handleSubmitIdea = async (e) => {
    e.preventDefault();
    
    if (!currentAccount) {
      alert('请先连接钱包');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData(e.target);
      const title = formData.get('title');
      const description = formData.get('description');
      const category = formData.get('category');
      const tags = formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag);

      // 使用 signAndExecuteTransactionBlock
      const result = await signAndExecuteTransactionBlock({
        transactionBlock: (tx) => {
          // 调用合约创建创意
          tx.moveCall({
            target: `${CONTRACT_PACKAGE_ID}::${CREATIVE_MODULE}::${CREATIVE_FUNCTION}`,
            arguments: [
              tx.pure.string(title),
              tx.pure.string(description),
              tx.pure.string(''), // content 字段，可以为空或存储具体内容
              tx.pure.string(category),
              tx.pure.vector('string', tags),
            ],
          });
        },
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      console.log('创意提交成功:', result);
      alert('创意提交成功！等待审核。');
      setShowSubmitForm(false);
      
      // 重置表单
      e.target.reset();
      
    } catch (error) {
      console.error('提交创意失败:', error);
      alert('提交创意失败，请重试');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="p-6 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-indigo-600">创意空间</h1>
            <p className="text-indigo-400">创意去中心化交易平台</p>
          </div>
        </div>
      </header>
      <Navbar />
      
      <main className="container mx-auto p-6">
        <section className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <input 
              type="text" 
              placeholder="搜索创意资源..." 
              className="w-full p-4 pl-12 rounded-full border border-indigo-100 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
            />
            <svg className="absolute left-4 top-4 h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">创意创作系统</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 创意卡片示例 */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="h-40 bg-indigo-50 rounded-lg mb-4"></div>
              <h3 className="text-lg font-medium text-indigo-800">创意游戏概念</h3>
              <p className="text-indigo-400 text-sm mt-1">独特的游戏创意和概念设计</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-indigo-600 font-medium">创意价值</span>
                <button 
                  className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                  onClick={() => setShowSubmitForm(true)}
                >
                  创意提交
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 创意提交表单弹窗 */}
      {showSubmitForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-indigo-700">创意提交表单</h3>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowSubmitForm(false)}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmitIdea}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">创意标题</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                  placeholder="请输入创意标题"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">创意描述</label>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                  rows="4"
                  placeholder="请详细描述您的创意..."
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">创意分类</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                  required
                >
                  <option value="">请选择分类</option>
                  <option value="game">游戏创意</option>
                  <option value="art">艺术创作</option>
                  <option value="tech">技术创新</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">标签 (用逗号分隔)</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                  placeholder="例如: 创意, 游戏, 独特"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button"
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  onClick={() => setShowSubmitForm(false)}
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  提交创意
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <footer className="p-6 bg-white/80 backdrop-blur-sm border-t border-gray-100">
        <p className="text-center text-indigo-400">© 2023 创意空间</p>
      </footer>
    </div>
  );
};

export default HomePage;
