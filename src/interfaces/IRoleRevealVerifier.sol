pragma solidity >=0.6.0;

interface IRoleRevealVerifier {
    function verify(bytes calldata) external view returns (bool result);
}