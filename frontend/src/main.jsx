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
  goerli,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Goerli } from "@thirdweb-dev/chains";

const { chains, publicClient } = configureChains(
  [goerli],
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <ThirdwebProvider
          activeChain={Goerli}
          clientId="e6375f666c4b9e2a910c29336018dba2"
        >
          <Router>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/success" element={<LoginSuccess />} />
              <Route path='/claim' element={<Claim />} />
            </Routes>
          </Router>
        </ThirdwebProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
)
