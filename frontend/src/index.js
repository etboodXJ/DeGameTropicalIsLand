import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import {
  ThemeVars ,
  
  SuiClientProvider,
  WalletProvider,
  createNetworkConfig,
} from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <SuiClientProvider
      rpcUrl="https://fullnode.testnet.sui.io:443"
    >
      <WalletProvider>
        <App />
      </WalletProvider>
    </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
