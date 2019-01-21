pragma solidity ^0.5.0;

//interface
contract Compliance {

    function canTransfer(address _from, address _to, uint256 value) public view returns(bool);
}
