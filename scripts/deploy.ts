import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  // deploy the role verifier
  const RoleVerifier = await ethers.getContractFactory("contracts/RoleVerifier.sol:TurboVerifier");
  const roleVerifier = await RoleVerifier.deploy();
  await roleVerifier.deployed();
  console.log(
    `RoleVerifier.sol deployed to ${roleVerifier.address}. Time: ${Date.now()}`
  );

  // deploy the role reveal verifier
  const RoleRevealVerifier = await ethers.getContractFactory("contracts/RoleRevealVerifier.sol:TurboVerifier");
  const roleRevealVerifier = await RoleRevealVerifier.deploy();
  await roleRevealVerifier.deployed();
  console.log(
    `RoleRevealVerifier.sol deployed to ${roleRevealVerifier.address}. Time: ${Date.now()}`
  );

  // deploy the main contract
  const Mafia = await ethers.getContractFactory("Mafia");
  const mafia = await Mafia.deploy(
    roleVerifier.address,
    roleRevealVerifier.address
  );
  await mafia.deployed();
  console.log(
    `Mafia.sol deployed to ${mafia.address}. Time: ${Date.now()}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});