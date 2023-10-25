// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint256 public count;

    event CounterUpdated(uint256 newValue);

    constructor() {
        count = 0;
    }

    function increment() public {
        count += 1;
        emit CounterUpdated(count);
    }

    function incrementBy(uint256 value) public {
        count += value;
        emit CounterUpdated(count);
    }
}
