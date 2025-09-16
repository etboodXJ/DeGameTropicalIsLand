import React from 'react';
import { ConnectButton } from '@mysten/dapp-kit';

const Navbar = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <a href="#" className="text-indigo-600 font-semibold">首页</a>
          <a href="#" className="text-indigo-500 hover:text-indigo-700">资源市场</a>
          <a href="#" className="text-indigo-500 hover:text-indigo-700">我的资产</a>
          
        </div>
        <div className="flex items-center space-x-4">
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
