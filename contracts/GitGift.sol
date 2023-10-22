// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "sismo-connect-solidity/SismoConnectLib.sol";
import "forge-std/console.sol";

contract GitGift is SismoConnect {

    struct Donation {
        address payable donor;
        uint256 amount;
    }

    struct ERC20Donation {
        address tokenAddress;
        uint256 amount;
    }

    mapping(uint256 => Donation[]) public ethDonations; // GitHub userId to ETH donations
    mapping(uint256 => ERC20Donation[]) public erc20Donations; // GitHub userId to ERC20 donations

    event DonatedETH(uint256 githubUserId, uint256 amount);
    event DonatedERC20(uint256 githubUserId, address tokenAddress, uint256 amount);
    event Claimed(uint256 githubUserId, uint256 ethAmount, address tokenAddress, uint256 tokenAmount);

    bytes16 private _appId = 0xf4977993e52606cfd67b7a1cde717069;
    bool private _isImpersonationMode = false;
    mapping(uint256 => bool) public claimed;

    using SismoConnectHelper for SismoConnectVerifiedResult;

    constructor() SismoConnect(buildConfig(_appId, _isImpersonationMode)) {}

    function donateETH(uint256 githubUserId) public payable {
        require(msg.value > 0, "Must send some ether");
        ethDonations[githubUserId].push(Donation({
            donor: payable(msg.sender),
            amount: msg.value
        }));
         claimed[githubUserId] = false;
        emit DonatedETH(githubUserId, msg.value);
    }

    function donateERC20(uint256 githubUserId, address tokenAddress, uint256 amount) public {
        require(amount > 0, "Must send some tokens");
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        erc20Donations[githubUserId].push(ERC20Donation({
            tokenAddress: tokenAddress,
            amount: amount
        }));
        claimed[githubUserId] = false;
        emit DonatedERC20(githubUserId, tokenAddress, amount);
    }

function claimWithSismo(bytes memory response) public {
    // Verify GitHub ownership using Sismo
    SismoConnectVerifiedResult memory result = verify({
        responseBytes: response,
        auth: buildAuth({authType: AuthType.GITHUB}),
        signature: buildSignature({message: abi.encode(msg.sender)})
    });

    uint256 rawGithubUserId = result.getUserId(AuthType.GITHUB);
    uint256 processedUserId = processNumber(rawGithubUserId);
    console.log("Processed GitHub UserId: %s", processedUserId);

    require(!claimed[processedUserId], "Already claimed");
    require(ethDonations[processedUserId].length > 0 || erc20Donations[processedUserId].length > 0, "No donations for this GitHub user");

    claimed[processedUserId] = true;

    // Claim ETH donations
    uint256 totalETH = 0;
    for (uint i = 0; i < ethDonations[processedUserId].length; i++) {
        totalETH += ethDonations[processedUserId][i].amount;
    }

    if (totalETH > 0) {
        payable(msg.sender).transfer(totalETH);
        delete ethDonations[processedUserId];
    }

    // Claim ERC20 donations
    for (uint i = 0; i < erc20Donations[processedUserId].length; i++) {
        ERC20Donation memory donation = erc20Donations[processedUserId][i];
        uint256 tokenBalance = IERC20(donation.tokenAddress).balanceOf(address(this));
        require(tokenBalance >= donation.amount, "Insufficient token balance in contract");
        IERC20(donation.tokenAddress).transfer(msg.sender, donation.amount);
        emit Claimed(processedUserId, 0, donation.tokenAddress, donation.amount);
    }

    if (erc20Donations[processedUserId].length > 0) {
        delete erc20Donations[processedUserId];
    }
}


    function decimalToHexadecimal(uint256 decimalNumber) public pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory result = new bytes(64); // max 64 characters for uint256
        uint256 index = 63;
        while (decimalNumber != 0) {
            uint8 remainder = uint8(decimalNumber % 16);
            result[index--] = alphabet[remainder];
            decimalNumber /= 16;
        }
        bytes memory trimmedResult = new bytes(64 - index - 1);
        for (uint i = 0; i < trimmedResult.length; i++) {
            trimmedResult[i] = result[i + index + 1];
        }
        return string(trimmedResult);
    }

    function findFirstNaturalNumberAfterSubstring(string memory inputString, string memory substring) public pure returns (uint256) {
        bytes memory inputBytes = bytes(inputString);
        bytes memory substringBytes = bytes(substring);

        // Find the index of the substring
        for (uint i = 0; i <= inputBytes.length - substringBytes.length; i++) {
            bool found = true;
            for (uint j = 0; j < substringBytes.length; j++) {
                if (inputBytes[i + j] != substringBytes[j]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                // Found the substring, now find the first natural number after it
                for (uint k = i + substringBytes.length; k < inputBytes.length; k++) {
                    if (inputBytes[k] >= '1' && inputBytes[k] <= '9') {
                        uint256 number = 0;
                        while (k < inputBytes.length && inputBytes[k] >= '0' && inputBytes[k] <= '9') {
                            number = number * 10 + uint256(uint8(inputBytes[k]) - 48); // 48 is ASCII for '0'
                            k++;
                        }
                        return number;
                    }
                }
            }
        }
        revert("Substring not found or no natural number after the substring");
    }

    function processNumber(uint256 decimalNumber) public pure returns (uint256) {
        string memory hexadecimalNumber = decimalToHexadecimal(decimalNumber);
        return findFirstNaturalNumberAfterSubstring(hexadecimalNumber, "1001");
    }

}
