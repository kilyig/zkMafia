// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");
import { ethers } from "hardhat";

// We use `loadFixture` to share common setups (or fixtures) between tests.
// Using this simplifies your tests and makes them run faster, by taking
// advantage of Hardhat Network's snapshot functionality.
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

require("@nomicfoundation/hardhat-chai-matchers");


// `describe` is a Mocha function that allows you to organize your tests.
// Having your tests organized makes debugging them easier. All Mocha
// functions are available in the global scope.
//
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.
describe("Token contract", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deployTokenFixture() {
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

    const [addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();

    return { mafia, addr1, addr2, addr3, addr4, addr5 };
  }

    describe("Basic Action", function () {    
        it("Should initialize without error", async function () {
          const {mafia, addr1, addr2, addr3, addr4, addr5} = await loadFixture(deployTokenFixture);
          
          const status = await mafia.areTheyAlive(addr1.address);
          expect(status).to.equal(false);

          await mafia.startGame();
          const status2 = await mafia.areTheyAlive(addr1.address);
          expect(status2).to.equal(true);
        });
    });


//   describe("Cycle deletion", function () {
//     it("Should create a cycle of length 10 and remove it", async function () {
//     const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

//     // Create 10 new accounts
//     const accounts = await ethers.getSigners();

//     // Create a cycle of length 10
//     const cycleAmount = 100;
//     for (let i = 0; i < 10; i++) {
//       const from = accounts[i];
//       const to = accounts[(i + 1) % 10];
//       await hardhatToken.connect(from).add_IOU(to.address, cycleAmount, 0, [from.address, from.address, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero]);
//       expect(await hardhatToken.lookup(from.address, to.address)).to.equal(cycleAmount);
//     }

//     // Remove the cycle
//     const cycleAddresses = (accounts.slice(0, 10).map(account => account.address));
//     cycleAddresses.push(accounts[0].address);
//     // console.log(cycleAddresses);
//     await hardhatToken.connect(accounts[0]).add_IOU(accounts[1].address, 0, cycleAmount, cycleAddresses);

//     // Check if the cycle is removed
//     for (let i = 0; i < 10; i++) {
//       // console.log(i);
//       const from = accounts[i];
//       const to = accounts[i + 1];
//       expect(await hardhatToken.lookup(from.address, to.address)).to.equal(0);
//     }
//     });

//     it("Should create a cycle of length 6 and remove it", async function () {
//     const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

//     // Create 10 new accounts
//     const accounts = await ethers.getSigners();

//     // Create a cycle of length 10
//     const cycleAmount = 100;
//     for (let i = 0; i < 6; i++) {
//       const from = accounts[i];
//       const to = accounts[(i + 1) % 10];
//       await hardhatToken.connect(from).add_IOU(to.address, cycleAmount, 0, [from.address, from.address, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero]);
//       expect(await hardhatToken.lookup(from.address, to.address)).to.equal(cycleAmount);
//     }

//     const cur = accounts[5];
//     const next = accounts[0];

//     await hardhatToken.connect(cur).add_IOU(next.address, cycleAmount, 0, [cur.address, cur.address, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero]);
//     expect(await hardhatToken.lookup(cur.address, next.address)).to.equal(cycleAmount);

//     // Remove the cycle
//     const cycleAddresses = [...accounts.slice(0, 6).map(account => account.address), accounts[0].address, ethers.constants.AddressZero,ethers.constants.AddressZero,ethers.constants.AddressZero,ethers.constants.AddressZero];
//     //cycleAddresses.concat(accounts[0].address);




//     // console.log(cycleAddresses);
//     await hardhatToken.connect(accounts[0]).add_IOU(accounts[1].address, 0, cycleAmount, cycleAddresses);

//     // Check if the cycle is removed
//     for (let i = 0; i < 5; i++) {
//       // console.log(i);
//       const from = accounts[i];
//       const to = accounts[i + 1];
//       expect(await hardhatToken.lookup(from.address, to.address)).to.equal(0);
//     }
//     expect(await hardhatToken.lookup(cur.address, next.address)).to.equal(0);
//     });

//     it("Should create a cycle of length 2 and remove it", async function () {
//     const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

//     // Create 10 new accounts
//     const accounts = await ethers.getSigners();

//     // Create a cycle of length 10
//     const cycleAmount = 100;
//     for (let i = 0; i < 1; i++) {
//       const from = accounts[i];
//       const to = accounts[(i + 1) % 10];
//       await hardhatToken.connect(from).add_IOU(to.address, cycleAmount, 0, [from.address, from.address, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero]);
//       expect(await hardhatToken.lookup(from.address, to.address)).to.equal(cycleAmount);
//     }

//     const cur = accounts[1];
//     const next = accounts[0];

//     await hardhatToken.connect(cur).add_IOU(next.address, cycleAmount, 0, [cur.address, cur.address, ethers.constants.AddressZero,ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero]);
//     expect(await hardhatToken.lookup(cur.address, next.address)).to.equal(cycleAmount);

//     // Remove the cycle
//     const cycleAddresses = [...accounts.slice(0, 2).map(account => account.address), accounts[0].address, ethers.constants.AddressZero,ethers.constants.AddressZero,ethers.constants.AddressZero,ethers.constants.AddressZero, ethers.constants.AddressZero,ethers.constants.AddressZero,ethers.constants.AddressZero,ethers.constants.AddressZero];
//     //cycleAddresses.concat(accounts[0].address);




//     // console.log(cycleAddresses);
//     await hardhatToken.connect(accounts[0]).add_IOU(accounts[1].address, 0, cycleAmount, cycleAddresses);

//     // Check if the cycle is removed
//     for (let i = 0; i < 2; i++) {
//       // console.log(i);
//       const from = accounts[i];
//       const to = accounts[i + 1];
//       expect(await hardhatToken.lookup(from.address, to.address)).to.equal(0);
//     }
//     expect(await hardhatToken.lookup(cur.address, next.address)).to.equal(0);
//     });

//     it("Null cycle", async function () {
//     const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

//     // Create 10 new accounts
//     const accounts = await ethers.getSigners();

//     // Create a cycle of length 10
//     const cycleAmount = 100;
//     for (let i = 0; i < 6; i++) {

//       if (i != 3) {
//         const from = accounts[i];
//         const to = accounts[(i + 1) % 10];
//         await hardhatToken.connect(from).add_IOU(to.address, cycleAmount, 0, [from.address, from.address, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero]);
//         expect(await hardhatToken.lookup(from.address, to.address)).to.equal(cycleAmount);
//       }
      
//     }

//     const cur = accounts[5];
//     const next = accounts[0];

//     await hardhatToken.connect(cur).add_IOU(next.address, cycleAmount, 0, [cur.address, cur.address, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero]);
//     expect(await hardhatToken.lookup(cur.address, next.address)).to.equal(cycleAmount);

//     // Remove the cycle
//     const cycleAddresses = [...accounts.slice(0, 6).map(account => account.address), accounts[0].address, ethers.constants.AddressZero,ethers.constants.AddressZero,ethers.constants.AddressZero,ethers.constants.AddressZero];
//     //cycleAddresses.concat(accounts[0].address);




//     // console.log(cycleAddresses);
//     await hardhatToken.connect(accounts[0]).add_IOU(accounts[1].address, 0, cycleAmount, cycleAddresses);

//     // Check if the cycle is removed
//     for (let i = 0; i < 5; i++) {
//       if (i != 3) {
//         // console.log(i);
//         const from = accounts[i];
//         const to = accounts[i + 1];
//         expect(await hardhatToken.lookup(from.address, to.address)).to.equal(cycleAmount);
//       }
//     }
//     expect(await hardhatToken.lookup(cur.address, next.address)).to.equal(cycleAmount);
//     });
// });




});