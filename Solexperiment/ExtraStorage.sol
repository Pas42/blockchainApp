// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SimpleStorage.sol";

contract ExtraStorage is SimpleStorage{
    // to override a parent function, add the override label to the function and virtual to the parent function
    function store(uint256 _favouriteNumber) public override {
        favouriteNumber = _favouriteNumber + 5;
    }
}