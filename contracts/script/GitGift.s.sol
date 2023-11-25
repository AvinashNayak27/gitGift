// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {GitGift} from "src/GitGift.sol";

contract DeployGitGift is Script {
  function run() public {
    vm.startBroadcast();
    GitGift gitGift = new GitGift();
    console.log("Gitgift Contract deployed at", address(gitGift));
    vm.stopBroadcast();
  }
}
