# GitGift 🎁

GitGift is an innovative application designed to facilitate donations to GitHub users using Ethereum (ETH) on the Base testnet. It integrates several advanced blockchain technologies to create a user-friendly and secure donation platform.

**Key Features of GitGift:**

1. **Seamless Donations:** Users can donate ETH to any GitHub user on the Base testnet with ease.
2. **Instant Notifications:** The application creates a GitHub issue to notify the recipient of the donation via email.
3. **Gasless Claims:** Recipients can claim donations without paying gas fees, thanks to ERC-4337 smart contract wallets.
4. **Identity Verification:** Sismo Connect is used to verify GitHub account ownership, preventing fraudulent claims.

**UX Optimization Strategies:**

- **Gasless Transactions:** The use of ERC-4337 smart contract wallets on the Base testnet via Thirdweb eliminates the need for recipients to pay gas fees.
- **Integrated Notifications:** Utilizing GitHub's existing notification system streamlines the process of informing recipients about donations.
- **Sismo Connect Integration:** This ensures that donations are claimed only by verified GitHub users, enhancing trust in the platform.

**How GitGift is Made:**

- **Frontend:** Built with ReactJS for a dynamic and responsive UI, and a component-based architecture for modularity and ease of maintenance.
- **Backend:** Utilizes Node.js for server-side logic and Express for server setup, API request handling, and service integration, ensuring scalability.
- **Smart Contract Development:** Foundry is used for creating, testing, and deploying smart contracts, which manage transactions securely and transparently.
- **Account Abstraction & Gasless Transactions:** Thirdweb tools are implemented for ERC-4337 smart contract wallets, providing a seamless user experience.
- **Identity Verification:** Sismo Connect is integrated for secure, privacy-preserving proof of GitHub account ownership.

