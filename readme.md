# GitGift 🎁

GitGift is an innovative application designed to facilitate donations to GitHub users using Ethereum (ETH) on the Base testnet. It integrates The Graph for efficient data querying and indexing,Sismo Connect and Thirdweb to create a user-friendly and secure donation platform.

[Demo Video](https://www.youtube.com/watch?v=_H1xatp979o)

## Key Features of GitGift:

- **Seamless Donations**: Users can donate ETH to any GitHub user on the Base testnet with ease.
- **Instant Notifications**: The application creates a GitHub issue to notify the recipient of the donation via email.
- **Gasless Claims**: Recipients can claim donations without paying gas fees, thanks to ERC-4337 smart contract wallets.
- **Identity Verification**: Sismo Connect is used to verify GitHub account ownership, preventing fraudulent claims.
- **Efficient Data Querying**: Utilizing The Graph's subgraph for indexing and querying blockchain data, enhancing the application's performance and user experience.

## Integration of The Graph in GitGift:

GitGift leverages The Graph's subgraph technology to efficiently manage and query blockchain data related to donations and claims. This integration plays a crucial role in the application:

- **Real-Time Data Accessibility**: The Graph's subgraph allows GitGift to access up-to-date information about donations and claims, ensuring that users have the latest data at their fingertips.

For more details on how The Graph's subgraph is implemented in GitGift, you can view the subgraph code [here](https://github.com/AvinashNayak27/gitGiftsubgraph). and test it at THe Graph's Subgraph Studio [here](https://thegraph.com/studio/subgraph/gitgift/playground)

**How GitGift is Made:**

- **Frontend:** Built with ReactJS for a dynamic and responsive UI, and a component-based architecture for modularity and ease of maintenance.
- **Backend:** Utilizes Node.js for server-side logic and Express for server setup, API request handling, and service integration, ensuring scalability.
- **Smart Contract Development:** Foundry is used for creating, testing, and deploying smart contracts, which manage transactions securely and transparently.
- **Account Abstraction & Gasless Transactions:** Thirdweb tools are implemented for ERC-4337 smart contract wallets, providing a seamless user experience.
- **Identity Verification:** Sismo Connect is integrated for secure, privacy-preserving proof of GitHub account ownership.
- **Data Querying:** Features a custom-built and deployed subgraph using The Graph, which facilitates efficient and effective querying of blockchain data, enhancing the application's functionality and user experience.
