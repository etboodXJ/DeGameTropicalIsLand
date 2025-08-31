import React from 'react';
import Navbar from '../components/Navbar';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="p-6 bg-white/80 backdrop-blur-sm shadow-sm">
        <h1 className="text-3xl font-bold text-indigo-600">GameDev Marketplace</h1>
        <p className="text-indigo-400">去中心化游戏开发资源交易平台</p>
      </header>
      <Navbar />
      
      <main className="container mx-auto p-6">
        <section className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <input 
              type="text" 
              placeholder="搜索游戏资源..." 
              className="w-full p-4 pl-12 rounded-full border border-indigo-100 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
            />
            <svg className="absolute left-4 top-4 h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">精选资源</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 资源卡片示例 */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="h-40 bg-indigo-50 rounded-lg mb-4"></div>
              <h3 className="text-lg font-medium text-indigo-800">3D角色模型包</h3>
              <p className="text-indigo-400 text-sm mt-1">包含10个高质量角色模型</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-indigo-600 font-medium">0.5 ETH</span>
                <button className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors">
                  查看详情
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="p-6 bg-white/80 backdrop-blur-sm border-t border-gray-100">
        <p className="text-center text-indigo-400">© 2023 GameDev Marketplace</p>
      </footer>
    </div>
  );
};

export default HomePage;