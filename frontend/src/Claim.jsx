import { SismoConnectButton, AuthType } from "@sismo-core/sismo-connect-react";
import { encodeAbiParameters } from "viem";

const signMessage = (address) => {
    return encodeAbiParameters(
        [{ type: "address", name: "GitGiftAddress" }],
        [address]
    );
};
import { useState } from "react";
import Navbar from "./Navbar";
import { useAddress, useContract, useContractWrite, useConnectionStatus } from "@thirdweb-dev/react";

export default function Claim() {
    const address = useAddress();
    const [responseBytes, setResponseBytes] = useState(null);
    const { contract } = useContract("0x08D20b6672D7C6B35A912B27B898F939530bBDE2")
    const { mutateAsync: claimWithSismo, isLoading } = useContractWrite(contract, "claimWithSismo")

    const call = async () => {
        try {
            const data = await claimWithSismo({ args: [responseBytes] });
            console.info("contract call successs", data);
            alert("Claimed!")

        } catch (err) {
            console.error("contract call failure", err);
            alert(err.message)
        }
    }

    return (
        <>
            <Navbar />
            {!address && (
                <div className="bg-orange-200 p-8 rounded-lg shadow-lg max-w-2xl mx-auto border-4 border-yellow-500 mt-8">
                    <p className="text-2xl text-center">
                        Please connect your wallet to continue.
                    </p>
                </div>
            )
            }

            {address && (
                <>
                    {!responseBytes ? (
                        <div className="bg-orange-200 p-8 rounded-lg shadow-lg max-w-2xl mx-auto border-4 border-yellow-500 mt-8">
                            <SismoConnectButton
                                config={{
                                    appId: "0xf4977993e52606cfd67b7a1cde717069", // replace with your appId
                                }}
                                auths={[{ authType: AuthType.GITHUB }]}
                                signature={{ message: signMessage(address) }}
                                onResponseBytes={async (response) => {
                                    setResponseBytes(response);
                                    console.log(response);
                                }}
                                className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600 transition duration-300"
                            />
                        </div>
                    ) : (
                        <div className="bg-orange-200 p-8 rounded-lg shadow-lg max-w-2xl mx-auto border-4 border-yellow-500 mt-8">
                            <button
                                onClick={call}
                                className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600 transition duration-300"
                            >
                                Claim
                            </button>
                        </div>
                    )}
                </>
            )}
        </>


    );
}
