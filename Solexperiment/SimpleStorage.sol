// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract SimpleStorage {
    // by default, if not declared, it will be initialized to 0
    uint256 public favouriteNumber;

    mapping(string => uint256) public nameToFavouriteNumber;

    struct People {
        uint256 favouriteNumber;
        string name;
    }

    // uint256[] public favouriteNumberList;
    People[] public people;

    function store(uint256 _favouriteNumber) public virtual{
        favouriteNumber = _favouriteNumber;
        // retrieve();
    }

    // view, pure doesnt modify the state of the 
    function retrieve() public view returns(uint256){
        return favouriteNumber;
    }

    // calldata is temporary data that cant be modified
    // memory is temporary data that can be modified
    // storage is permanant data that cant be modified
    function addPerson(string memory _name, uint256 _favouriteNumber) public {
        people.push(People(_favouriteNumber, _name));
        nameToFavouriteNumber[_name] = _favouriteNumber;
    }
}

