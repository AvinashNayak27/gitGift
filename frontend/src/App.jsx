import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import GitHubLoginButton from "./GitHubLoginButton";
import { useAccount } from "wagmi";
import Navbar from "./Navbar";
import { utils } from "ethers";

import { useContract, useContractWrite, Web3Button } from "@thirdweb-dev/react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("githubAccessToken");
    if (token) {
      setIsLoggedIn(true);
      fetchUserData(token);
      fetchUserFollowers(token);
    }
  }, []);

  const { contract } = useContract(
    "0x144b8A177c1C735065c9c8C1016a1bEf20d112a7"
  );
  const { mutateAsync, isLoading } = useContractWrite(contract, "donateETH");

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("https://api.github.com/user", {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchUserFollowers = async (token) => {
    try {
      const response = await axios.get(
        "https://api.github.com/user/followers",
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );
      setFollowers(response.data);
    } catch (error) {
      console.error("Error fetching user followers:", error);
    }
  };

  const { address, isConnected } = useAccount();

  const {
    mutateAsync: donateERC20,
    isLoading: apeloading,
    isSuccess,
  } = useContractWrite(contract, "donateERC20");

  const { contract: apeContract } = useContract(
    "0x4CDE1cDCDC24A52A7Fa664f7A96eD183d44985fb"
  );
  const { mutateAsync: approve } = useContractWrite(apeContract, "approve");

  const call = async (githubUserId) => {
    try {
      const approvedData = await approve({
        args: [
          "0x144b8A177c1C735065c9c8C1016a1bEf20d112a7",
          "200000000000000000000",
        ],
      });
      const data = await donateERC20({
        args: [
          githubUserId,
          "0x328507DC29C95c170B56a1b3A758eB7a9E73455c",
          "200000000000000000000",
        ],
      });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  return (
    <div className="App bg-gradient-to-r from-teal-400 to-teal-600 p-8">
      <Navbar />

      <header className="App-header text-center py-16 border-b-4 border-yellow-500">
        <h1 className="text-5xl font-extrabold mb-8 text-yellow-200 tracking-widest">
          Welcome to GitGift
        </h1>
        {!isLoggedIn && <GitHubLoginButton />}
        {isLoggedIn && userData && (
          <div className="bg-orange-200 p-8 rounded-lg shadow-lg max-w-2xl mx-auto border-4 border-yellow-500">
            <img
              src={userData.avatar_url}
              alt="User Avatar"
              className="w-32 h-32 mx-auto rounded-full shadow-md mb-6 border-4 border-yellow-500"
            />
            <p className="text-2xl font-semibold mb-3 text-teal-800">
              Username: {userData.login}
            </p>
            <p className="text-xl mb-3 text-teal-700">Name: {userData.name}</p>
            <p className="text-lg mb-6 text-teal-600">Bio: {userData.bio}</p>
            <h2 className="text-4xl font-bold mb-6 tracking-wider">
              Followers:
            </h2>
            <ul className="grid grid-cols-2 gap-6">
              {followers.map((follower) => (
                <li key={follower.id} className="flex items-center space-x-4">
                  <img
                    src={follower.avatar_url}
                    alt="Follower Avatar"
                    className="w-16 h-16 rounded-full border-2 border-yellow-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-lg font-medium text-teal-800">
                      {follower.login}
                    </span>
                    <span className="text-sm text-gray-700 mb-2">
                      {follower.id}
                    </span>
                    <div className="group relative">
                      <Web3Button
                        contractAddress={
                          "0x144b8A177c1C735065c9c8C1016a1bEf20d112a7"
                        }
                        action={() =>
                          mutateAsync({
                            args: [follower.id],
                            overrides: {
                              gasLimit: 1000000, // override default gas limit
                              value: utils.parseEther("0.01"), // send 0.1 native token with the contract call
                            },
                          })
                        }
                        onSuccess={() => {
                          alert(
                            "Gift sent! Check active issue at https://github.com/AvinashNayak27/gitGift/issues"
                          );
                        }}
                      >
                        Gift
                      </Web3Button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                        onClick={() => call(follower.id)}
                      >
                        Gift testnet APE
                      </button>
                      {isSuccess && (
                        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-3 py-1 text-xs text-white bg-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Gift sent! Check active issue at{" "}
                          <a href="https://github.com/AvinashNayak27/gitGift/issues">
                            GitHub
                          </a>
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
