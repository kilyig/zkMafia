import { expect } from "chai";
import { ethers } from "hardhat";
import path from "path";

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

import { compile, acir_to_bytes } from '@noir-lang/noir_wasm';
import { setup_generic_prover_and_verifier, create_proof, verify_proof } from '@noir-lang/barretenberg/dest/client_proofs';
import { getCircuitSize } from '@noir-lang/barretenberg/dest/client_proofs/generic_proof/standard_example_prover';
import { serialise_acir_to_barrtenberg_circuit } from '@noir-lang/aztec_backend';
import { BarretenbergWasm } from '@noir-lang/barretenberg/dest/wasm';
import { writeFileSync } from "fs";


describe("Hello", function () {
    let verifierContract: any;
    let prove_role_acir: any;
    let prove_role_abi: any;
    let prove_role_prover: any;
    let prove_role_verifier: any;
    let role_reveal_acir: any;
    let role_reveal_abi: any;
    let role_reveal_prover: any;
    let role_reveal_verifier: any;

    async function deployTokenFixture() {
        // deploy the role verifier
        // const ProveRoleVerifier = await ethers.getContractFactory("src/ProveRoleVerifier.sol:TurboVerifier");
        // const ProveRoleVerifier = await ethers.getContractFactory("ProveRoleVerifier");
        const ProveRoleVerifier = await ethers.getContractFactory("src/ProveRoleVerifier.sol:TurboVerifier");
        const proveRoleVerifier = await ProveRoleVerifier.deploy();
        await proveRoleVerifier.deployed();
        console.log(
          `ProveRoleVerifier.sol deployed to ${proveRoleVerifier.address}. Time: ${Date.now()}`
        );
    
        // deploy the role reveal verifier
        //const RoleRevealVerifier = await ethers.getContractFactory("RoleRevealVerifier");
        const RoleRevealVerifier = await ethers.getContractFactory("src/RoleRevealVerifier.sol:TurboVerifier");
        //const RoleRevealVerifier = await ethers.getContractFactory("src/RoleRevealVerifier.sol:TurboVerifier");
        const roleRevealVerifier = await RoleRevealVerifier.deploy();
        await roleRevealVerifier.deployed();
        console.log(
          `RoleRevealVerifier.sol deployed to ${roleRevealVerifier.address}. Time: ${Date.now()}`
        );
    
        // deploy the main contract
        const Mafia = await ethers.getContractFactory("Mafia");
        const mafia = await Mafia.deploy(
          proveRoleVerifier.address,
          roleRevealVerifier.address
        );
        await mafia.deployed();
        console.log(
          `Mafia.sol deployed to ${mafia.address}. Time: ${Date.now()}`
        );
    
        const [addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    
        return { mafia, addr1, addr2, addr3, addr4, addr5 };
    }

    before(async function() {
        const prove_role_compiled_program = compile(path.resolve(__dirname, "../circuits/prove_role/src/main.nr"));

        prove_role_acir = prove_role_compiled_program.circuit;
        prove_role_abi = prove_role_compiled_program.abi;

        // console.log("abi", abi);

        const prove_role_serialised_circuit = serialise_acir_to_barrtenberg_circuit(prove_role_acir);
        const barretenberg = await BarretenbergWasm.new();
        const prove_role_circSize = await getCircuitSize(barretenberg, prove_role_serialised_circuit);
        console.log("circSize", prove_role_circSize);
        
        [prove_role_prover, prove_role_verifier] = await setup_generic_prover_and_verifier(prove_role_acir);

        // console.log(serialised_circuit);
        writeFileSync(path.resolve(__dirname, "../circuits/prove_role/src/prove_role_circuit.buf"), Buffer.from(prove_role_serialised_circuit));

        // console.log(acir_to_bytes(acir));
        writeFileSync(path.resolve(__dirname, "../circuits/prove_role/src/prove_role_acir.buf"), Buffer.from(acir_to_bytes(prove_role_acir)));
        
        // Here down is for role_reveal
        const role_reveal_compiled_program = compile(path.resolve(__dirname, "../circuits/role_reveal/src/main.nr"));

        role_reveal_acir = role_reveal_compiled_program.circuit;
        role_reveal_abi = role_reveal_compiled_program.abi;

        // console.log("abi", abi);

        const serialised_circuit = serialise_acir_to_barrtenberg_circuit(role_reveal_acir);
        const circSize = await getCircuitSize(barretenberg, serialised_circuit);
        console.log("circSize", circSize);
        
        [role_reveal_prover, role_reveal_verifier] = await setup_generic_prover_and_verifier(role_reveal_acir);

        // console.log(serialised_circuit);
        writeFileSync(path.resolve(__dirname, "../circuits/role_reveal/src/role_reveal_circuit.buf"), Buffer.from(serialised_circuit));

        // console.log(acir_to_bytes(acir));
        writeFileSync(path.resolve(__dirname, "../circuits/role_reveal/src/role_reveal_acir.buf"), Buffer.from(acir_to_bytes(role_reveal_acir)));
    });

    it("Prove_role verify proof in nargo", async function () {
        prove_role_abi.role = 1;
        prove_role_abi.role_hashes = [
            "0x26ef38b3202a99ac35fe7ee4c3a6f7c6426ea6c2efa34073a7a91bc308b0f6ce",
            "0x2d80907c69cecc68fbd43a0299e25ceb6d81340cc36f8776a491ac05f1742e2f",
            "0x00f649ef5b95797dae1c5e0a46ecb4513812a91b038d26d68a4b1f5f5afe24ab",
            "0x2baf78ba8b20da37793a85632e98dee3a8c9e33260553e7a8576697148e8f48c",
            "0x0440661377df8c650e0f27cad4a04257dc6e9f603d2febe8ab622f755787ef85"
        ];
        prove_role_abi.salt = 1234567;

        const proof = await create_proof(prove_role_prover, prove_role_acir, prove_role_abi);
        const verified = await verify_proof(prove_role_verifier, proof);

        expect(verified).eq(true);
    });

    it("role_reveal verify proof in nargo", async function () {
        role_reveal_abi.role = 0;
        role_reveal_abi.roleHash = "0x26ef38b3202a99ac35fe7ee4c3a6f7c6426ea6c2efa34073a7a91bc308b0f6ce";
        role_reveal_abi.salt = 123;

        const proof = await create_proof(role_reveal_prover, role_reveal_acir, role_reveal_abi);
        const verified = await verify_proof(role_reveal_verifier, proof);

        expect(verified).eq(true);
    });

    it("Should initialize without error", async function () {
        const {mafia, addr1, addr2, addr3, addr4, addr5} = await loadFixture(deployTokenFixture);
        
        const status = await mafia.areTheyAlive(addr1.address);
        expect(status).to.equal(false);

        await mafia.startGame();
        const status2 = await mafia.areTheyAlive(addr1.address);
        expect(status2).to.equal(true);

      });

    // it("Should reject false proof", async function () {
    //     abi.x = 2;
    //     abi.y = 2;

    //     const proof = await create_proof(prover, acir, abi);
    //     const verified = await verify_proof(verifier, proof);

    //     expect(verified).eq(false);
    // });

    // it("Should verify proof in smart contract", async function () {
    //     abi.x = 2;
    //     abi.y = 3;

    //     const proof = await create_proof(prover, acir, abi);
    //     const sc_verified = await verifierContract.verify(proof);

    //     expect(sc_verified).eq(true);
    // });

    // it("Should reject false proof in smart contract", async function () {
    //     abi.x = 3;
    //     abi.y = 3;

    //     const proof = await create_proof(prover, acir, abi);

    //     await expect(verifierContract.verify(proof)).to.be.revertedWith("Proof failed");
    // });
});
