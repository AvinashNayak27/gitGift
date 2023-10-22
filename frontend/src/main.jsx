import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSuccess from './Success.jsx';
import Claim from './Claim.jsx';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  polygonMumbai,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ThirdwebProvider, smartWallet, embeddedWallet, metamaskWallet, localWallet } from "@thirdweb-dev/react";
import { Mumbai } from "@thirdweb-dev/chains";

const { chains, publicClient } = configureChains(
  [polygonMumbai],
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
  factoryAddress: "0x2d27d0302cca2d9e540ffd628c9a68238bc1a3ab",
  gasless: true,
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <ThirdwebProvider
        activeChain={Mumbai}
        clientId="3dabe0bac070c732639774e387ed5ad1"
        supportedWallets={[
          metamaskWallet(),
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
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/success" element={<LoginSuccess />} />
            <Route path='/claim' element={<Claim />} />
          </Routes>
        </Router>
      </ThirdwebProvider>

    </WagmiConfig>
  </React.StrictMode>,
)

