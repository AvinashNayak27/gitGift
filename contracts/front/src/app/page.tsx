"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useContractWrite,
  useDisconnect,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
} from "wagmi";
import {
  mainnet,
  goerli,
  sepolia,
  optimism,
  optimismGoerli,
  arbitrum,
  arbitrumGoerli,
  scrollTestnet,
  gnosis,
  polygon,
  polygonMumbai,
  base,
  baseGoerli,
} from "wagmi/chains";
import { waitForTransaction } from "@wagmi/core";
import { decodeEventLog, formatEther } from "viem";
import { abi as GitGiftABI } from "../../../abi/GitGift.json";
import { errorsABI, formatError, fundMyAccountOnLocalFork, signMessage } from "@/utils/misc";
import { mumbaiFork } from "@/utils/wagmi";
import {
  SismoConnectButton, // the Sismo Connect React button displayed below
  SismoConnectConfig, // the Sismo Connect config with your appId
  AuthType, // the authType enum, we will choose 'VAULT' in this tutorial
  ClaimType, // the claimType enum, we will choose 'GTE' in this tutorial, to check that the user has a value greater than a given threshold
} from "@sismo-core/sismo-connect-react";
import { transactions } from "../../../broadcast/GitGift.s.sol/5151111/run-latest.json";

/* ***********************  Sismo Connect Config *************************** */

// you can create a new Sismo Connect app at https://factory.sismo.io
// The SismoConnectConfig is a configuration needed to connect to Sismo Connect and requests data from your users.

const sismoConnectConfig: SismoConnectConfig = {
  appId: "0xf4977993e52606cfd67b7a1cde717069",
};

/* ********************  Defines the chain to use *************************** */
const CHAIN = mumbaiFork;

export default function Home() {
  /* ***********************  Application states *************************** */
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [amountClaimed, setAmountClaimed] = useState<string>("");
  const [responseBytes, setResponseBytes] = useState<string>("");

  /* ***************  Wagmi hooks for wallet connection ******************** */
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { isConnected, address } = useAccount({
    onConnect: async ({ address }) => address && (await fundMyAccountOnLocalFork(address)),
  });
  const { switchNetworkAsync, switchNetwork } = useSwitchNetwork();

  /* *************  Wagmi hooks for contract interaction ******************* */
  const contractCallInputs =
    responseBytes && chain
      ? {
        address: transactions[0].contractAddress as `0x${string}}`,
        abi: [...GitGiftABI, ...errorsABI],
        functionName: "claimWithSismo",
        args: [responseBytes],
        chain,
      }
      : {};

  const { config, error: wagmiSimulateError } = usePrepareContractWrite(contractCallInputs);
  const { writeAsync } = useContractWrite(config);

  /* *************  Handle simulateContract call & chain errors ************ */
  useEffect(() => {
    if (chain?.id !== CHAIN.id) return setError(`Please switch to ${CHAIN.name} network`);
    setError("");
  }, [chain]);

  useEffect(() => {
    if (!wagmiSimulateError) return;
    if (!isConnected) return;
    return setError(formatError(wagmiSimulateError));
  }, [wagmiSimulateError, isConnected]);

  /* ************  Handle the GitGift claim button click ******************* */
  async function claimGitGift() {
    if (!address) return;
    setError("");
    setLoading(true);
    try {
      // Switch to the selected network if not already on it
      if (chain?.id !== CHAIN.id) await switchNetworkAsync?.(CHAIN.id);
      const tx = await writeAsync?.();
      const txReceipt = tx && (await waitForTransaction({ hash: tx.hash }));
      if (txReceipt?.status === "success") {
        const mintEvent = decodeEventLog({
          abi: GitGiftABI,
          data: txReceipt.logs[0]?.data,
          topics: txReceipt.logs[0]?.topics,
        });
        const args = mintEvent?.args as {
          value: string;
        };
        const ethAmount = formatEther(BigInt(args.value));
        setAmountClaimed(ethAmount);
      }
    } catch (e: any) {
      setError(formatError(e));
    } finally {
      setLoading(false);
    }
  }

  /* *************************  Reset state **************************** */
  function resetApp() {
    disconnect();
    setAmountClaimed("");
    setResponseBytes("");
    setError("");
    const url = new URL(window.location.href);
    url.searchParams.delete("sismoConnectResponseCompressed");
    window.history.replaceState({}, "", url.toString());
  }

  return (
    <>
      <main className={styles.main}>
        <h1>
          <b> Tutorial</b>
          <br />
          Sismo Connect onchain
        </h1>

        {!isConnected && (
          <>
            <p>This is a simple ERC20 gated GitGift example using Sismo Connect.</p>
            {connectors.map((connector) => (
              <button
                disabled={!connector.ready || isLoading}
                key={connector.id}
                onClick={() => connect({ connector })}
              >
                {isLoading && pendingConnector?.id === connector.id
                  ? "Connecting..."
                  : "Connect wallet"}
              </button>
            ))}
          </>
        )}

        {isConnected && !responseBytes && (
          <>
            <p>Using Sismo Connect we will protect our GitGift from:</p>
            <br />
            <ul>
              <li>Double-spending: each user has a unique Vault id derived from your app id.</li>
              <li>Front-running: the GitGift destination address is sent as signature request</li>
            </ul>
            <br />
            <p>
              <b>Chain: {chain?.name}</b>
              <br />
              <b>Your GitGift destination address is: {address}</b>
            </p>

            <SismoConnectButton
              // the client config created
              config={sismoConnectConfig}
              // the auth request we want to make
              // here we want the proof of a Sismo Vault ownership from our users
              auths={[
                { authType: AuthType.GITHUB }
              ]}
              // we ask the user to sign a message
              // it will be used onchain to prevent frontrunning
              signature={{ message: signMessage(address) }}
              // onResponseBytes calls a 'setResponse' function with the responseBytes returned by the Sismo Vault
              onResponseBytes={(responseBytes: string) => {
                console.log(responseBytes)
                setResponseBytes(responseBytes);
              }}
              // Some text to display on the button
              text={"Claim with Sismo"}
            />
          </>
        )}

        {isConnected && responseBytes && !amountClaimed && (
          <>
            <p>Chain: {chain?.name}</p>
            <p>Your GitGift destination address is: {address}</p>
            <button disabled={loading || Boolean(error)} onClick={() => claimGitGift()}>
              {!loading ? "Claim" : "Claiming..."}
            </button>
          </>
        )}

        {isConnected && responseBytes && amountClaimed && (
          <>
            <p>Congratulations!</p>
            <p>
              You have claimed {amountClaimed} tokens on {address}.
            </p>
          </>
        )}
        {isConnected && !amountClaimed && error && (
          <>
            <p className={styles.error}>{error}</p>
            {error.slice(0, 16) === "Please switch to" && (
              <button onClick={() => switchNetwork?.(CHAIN.id)}>Switch chain</button>
            )}
          </>
        )}
      </main>

      {isConnected && (
        <button className={styles.disconnect} onClick={() => resetApp()}>
          Reset
        </button>
      )}
    </>
  );
}


///0x0000000000000000000000000000000000000000000000000000000000000020f4977993e52606cfd67b7a1cde71706900000000000000000000000000000000b8e2054f8a912367e38a22ce773328ff000000000000000000000000000000007369736d6f2d636f6e6e6563742d76312e31000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000a00c4d7f2b79b7106ceae5cf553f30a5b5e8ca2f0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001a068796472612d73332e310000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000004a000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000100100000000000000000000000000010034215700000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002c030447c5962f6c6f3abb64929e32560d93a1722b44b09f9393c074a7ca619a3831861114d789772cde40a02b348b9342e2082f76ffc1c62f92cccb1c772464a8c056c6d4a919abebb08f05e9e895c4f99508f246a8961fc5d98eff83bee81ca542427a844a8cb6d58e5c8814e50d3c7d7c99a1c7423f57962e6adb1d73ee2e87f294e745cfaec7eb22ec7f177fa2ebc1340b056311780ededfaff1834a11aa1511d6e54fbe5ffd15e00a0d82ba4b6747f2ff1c020ac26fbadd725eb39872765502eb0313c9d5dcebdd4e21ac9057d5007f48cf93eda8cc83db7b8e7b5c664baad05c3fa17a7a869df14d0b49f7638b924be16314976451d84304e9ea78344c6dd00000000000000000000000010010000000000000000000000000001003421573035c1a09df78f6d525ac15742d606f1853a8963024713dd96c59a5f4277047307f6c5612eb579788478789deccb06cf0eb168e457eea490af754922939ebdb920706798455f90ed993f8dac8075fc1538738a25f0c928da905c0dffd81869fa00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007bf8e0d2bbd0ff5786ae3824d980bd17eb598e610a671c07d41f5f99a17c1e702c02b0c8903e5f139b466d5bc5ceda4a647c4c72486e6d61de22fc3805abdd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000
