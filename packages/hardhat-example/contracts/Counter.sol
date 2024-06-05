// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Counter {

    uint256 public counter;

    function increment() public {
        counter++;
    }
}
