import React from 'react';
import { ConnectWallet } from "@thirdweb-dev/react";


function Navbar() {
    return (
        <nav className="bg-teal-500 p-4 shadow-md">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <div className="text-white font-bold text-xl">
                        <a href="/" className="text-white font-bold text-xl hover:text-teal-300 transition duration-300">
                            GitGift
                        </a>

                    </div>
                    <ul className="flex items-center space-x-4">
                        <li>
                            <a href="/claim" className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-800 transition duration-300">
                                Claims
                            </a>
                        </li>

                        <ConnectWallet
                            theme="dark"
                            btnTitle="Connect Wallet"
                            switchToActiveChain={true}
                        />


                    </ul>
                </div>
            </div>
        </nav>

    );
}

export default Navbar;
