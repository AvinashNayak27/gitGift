import { useState } from "react";
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import { useQuery } from 'urql';
import { SismoConnectButton, AuthType } from "@sismo-core/sismo-connect-react";
import { encodeAbiParameters } from "viem";
import Navbar from "./Navbar";
import { useMemo } from "react";
import axios from "axios";
import { useEffect } from "react";

const CLAIMED_QUERY = `
  {
    claimeds {
      githubUserId
      blockTimestamp
    }
  }
`;

const DONATED_ETH_QUERY = `
  {
    donatedETHs {
      id
      githubUserId
      amount
      blockTimestamp
    }
  }
`;

export default function CombinedComponent() {
  const address = useAddress();
  const [responseBytes, setResponseBytes] = useState(null);
  const { contract } = useContract("0x9fE69604504f6089c64cB774D015890541F808de");
  const { mutateAsync: claimWithSismo, isLoading } = useContractWrite(contract, "claimWithSismo");

  const [claimedResult] = useQuery({ query: CLAIMED_QUERY });
  const [donatedResult] = useQuery({ query: DONATED_ETH_QUERY });
  const [loadingStates, setLoadingStates] = useState({});
  const sortedDonations = useMemo(() => {
    return donatedResult.data?.donatedETHs
      .slice() // Create a copy to avoid mutating the original array
      .sort((a, b) => b.blockTimestamp - a.blockTimestamp) // Sort by timestamp in descending order
      .map(donation => ({
        ...donation,
        amount: donation.amount / 10**18 // Convert Wei to Ether
      }));
  }, [donatedResult.data]);

  const [usernames, setUsernames] = useState({});

  const fetchUsername = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      setUsernames(prev => ({ ...prev, [userId]: response.data.login })); // Assuming 'login' is the username field
    } catch (error) {
      console.error("Error fetching username:", error);
      // Handle error (e.g., set a default username, show error message, etc.)
    }
  };

  useEffect(() => {
    donatedResult.data?.donatedETHs.forEach(donation => {
      if (!usernames[donation.githubUserId]) {
        fetchUsername(donation.githubUserId);
      }
    });
  }, [donatedResult.data, usernames]);


  const isLoadingData = claimedResult.fetching || donatedResult.fetching;
  const error = claimedResult.error || donatedResult.error;

  const signMessage = (address) => {
    return encodeAbiParameters(
      [{ type: "address", name: "GitGiftAddress" }],
      [address]
    );
  };

  const startLoading = (id) => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));
  };

  const stopLoading = (id) => {
    setLoadingStates(prev => ({ ...prev, [id]: false }));
  };

  const call = async (donatedId) => {
    try {
      startLoading(donatedId);
      const data = await claimWithSismo({ args: [responseBytes] });
      console.info("contract call success", data);
      alert("Claimed!");
    } catch (err) {
      console.error("contract call failure", err);
      alert(err.message);
    } finally {
      stopLoading(donatedId);
    }
  };

  const hasUserClaimed = (githubUserId, donationTimestamp) => {
    return claimedResult.data?.claimeds.some(claimed => 
      claimed.githubUserId === githubUserId && claimed.blockTimestamp > donationTimestamp
    );
  };

  if (isLoadingData) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;



  return (
    <>
      <Navbar />
      {!address ? (
        <div className="bg-orange-200 p-8 rounded-lg shadow-lg max-w-2xl mx-auto border-4 border-yellow-500 mt-8">
          <p className="text-2xl text-center">
            Please connect your wallet to continue.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap -m-4 mt-4 ml-2 mr-2">
          {sortedDonations?.map((donated) => (
            <div key={donated.id} className="p-4 md:w-1/2 lg:w-1/3">
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-base font-medium text-indigo-600 mb-1">Donation</h2>
                  <h1 className="text-2xl font-semibold mb-3">GitHub User: {usernames[donated.githubUserId] || 'Loading...'}</h1>
                  <p className="leading-relaxed mb-3">Amount: {donated.amount} ETH</p>
                  <p className="leading-relaxed">Timestamp: {new Date(donated.blockTimestamp * 1000).toLocaleString()}</p>
                  {!hasUserClaimed(donated.githubUserId, donated.blockTimestamp) && !responseBytes ? (
                    <SismoConnectButton
                      config={{ appId: "0xf4977993e52606cfd67b7a1cde717069" }}
                      auths={[{ authType: AuthType.GITHUB }]}
                      signature={{ message: signMessage(address) }}
                      onResponseBytes={async (response) => {
                        setResponseBytes(response);
                        console.log(response);
                      }}
                      className="mt-4 w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                    />
                  ) : (
                    <button 
                      onClick={() => call(donated.id)}
                      disabled={loadingStates[donated.id] || hasUserClaimed(donated.githubUserId, donated.blockTimestamp)}
                      className={`mt-4 w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 ${
                        loadingStates[donated.id] || hasUserClaimed(donated.githubUserId, donated.blockTimestamp) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {loadingStates[donated.id] ? "Loading..." : hasUserClaimed(donated.githubUserId, donated.blockTimestamp) ? 'Already Claimed' : 'Claim'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
