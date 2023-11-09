import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { useAccount } from "wagmi";
import Navbar from "./Navbar";
import SearchBar from "./Search";

import { useContract, useContractWrite, Web3Button } from "@thirdweb-dev/react";
import { useGithubProfile } from './GithubProfileContext';
import { utils } from "ethers";

function App() {
  const { contract } = useContract(
    "0x454ce17407Fd9dF321e97FeaED0e24334d90C636"
  );
  const { mutateAsync, isLoading, isSuccess } = useContractWrite(
    contract,
    "donateETH"
  );

  const { address, isConnected } = useAccount();
  const { selectedGithubId } = useGithubProfile();

  const [selectedGithubusername, setSelectedGithubUsername] = useState(null);

  // if selectedGithubId send a get request to the backend to get the github profile

  useEffect(() => {
    if (selectedGithubId) {
      axios
        .get(`http://localhost:3000/users/${selectedGithubId}`)
        .then((res) => {
          console.log(res.data);
          setSelectedGithubUsername(res.data.login);
        })
        .catch((err) => console.log(err));
    }
  
  }, [selectedGithubId]);
  

  return (
    <div className="App bg-gradient-to-r from-teal-400 to-teal-600 p-4 md:p-8 min-h-screen">
      <Navbar />

      <div className="App-header text-center py-10 md:py-16 border-b-4 border-yellow-500">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 md:mb-8 text-yellow-200 tracking-widest">
          Welcome to GitGift
        </h1>
        <p className="text-xl md:text-2xl text-yellow-200">
          Donate to your favorite open source contributors
        </p>

        <SearchBar />

        {selectedGithubId && (
          // call the donateETH function on the contract
          <Web3Button
          contractAddress={
            "0x454ce17407Fd9dF321e97FeaED0e24334d90C636"
          }
          action={() =>
            mutateAsync({
              args: [selectedGithubId],
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
          Gift {selectedGithubusername} 0.01 ETH
        </Web3Button>
        )}

      </div>
    </div>
  );
}

export default App;
