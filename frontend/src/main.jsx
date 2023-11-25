import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Claim from './Claim.jsx';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  baseGoerli,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ThirdwebProvider, smartWallet, embeddedWallet, metamaskWallet, localWallet } from "@thirdweb-dev/react";
import { BaseGoerli } from "@thirdweb-dev/chains";
import { createClient, Provider } from 'urql';

// URQL Client
const client = createClient({
  url: 'https://api.studio.thegraph.com/query/59475/gitgift/version/latest/'
});

const { chains, publicClient } = configureChains(
  [baseGoerli],
  [
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

const smartWalletOptions = {
  factoryAddress: "0x97a277e9b325785b9a4c33d4e39c8d6193b54f83",
  gasless: true,
};

import { GithubProfileProvider } from './GithubProfileContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <ThirdwebProvider
        activeChain={BaseGoerli}
        clientId="3dabe0bac070c732639774e387ed5ad1"
        supportedWallets={[
          smartWallet(
            metamaskWallet(),
            smartWalletOptions,
          ),
          smartWallet(
            localWallet(),
            smartWalletOptions,
          ),
          smartWallet(
            embeddedWallet(),
            smartWalletOptions,
          ),
        ]}
      >
        <Provider value={client}>
        <GithubProfileProvider>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path='/claim' element={<Claim />} />
          </Routes>
        </Router>
        </GithubProfileProvider>
        </Provider>
      </ThirdwebProvider>

    </WagmiConfig>
  </React.StrictMode>,
)

