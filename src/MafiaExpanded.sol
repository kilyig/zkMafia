// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

// Verification of the zkps on the smart contract
// is done by communcating with the verifier contracts
// produced by Noir
import "./interfaces/IProveRoleVerifier.sol";
import "./interfaces/IRoleRevealVerifier.sol";

contract Mafia {

    IProveRoleVerifier proveRoleVerifier;
    IRoleRevealVerifier roleRevealVerifier;
    
    struct MafiaGame {
        mapping(address => bool) isAlive;
        mapping(address => uint) roleCommits;
        mapping(address => address) votes;
        mapping(address => uint) voteTallies;
        address[] players;
        bool nightTime; // 0=Night time (when players take action); 1=Day time (when players vote)
        uint couchSurferCommit;
        uint round;
        uint numVotesReceived;
        uint numAlive;
        uint killedMafiaCount;
    }

    MafiaGame game;

    constructor(
        address _proveRoleVerifier,
        address _roleRevealVerifier
    ) payable {
        proveRoleVerifier = IProveRoleVerifier(_proveRoleVerifier);
        roleRevealVerifier = IRoleRevealVerifier(_roleRevealVerifier);
    }

    function startGame() public {
        // Hardcoded players        
        game.players = [0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,    0x70997970C51812dc3A010C7d01b50e0d17dc79C8,    0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC,    0x90F79bf6EB2c4f870365E785982E1f101E93b906,    0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65];
        uint[5] memory commits = [
            0x26ef38b3202a99ac35fe7ee4c3a6f7c6426ea6c2efa34073a7a91bc308b0f6ce,
            0x2d80907c69cecc68fbd43a0299e25ceb6d81340cc36f8776a491ac05f1742e2f,
            0x00f649ef5b95797dae1c5e0a46ecb4513812a91b038d26d68a4b1f5f5afe24ab,
            0x2baf78ba8b20da37793a85632e98dee3a8c9e33260553e7a8576697148e8f48c,
            0x0440661377df8c650e0f27cad4a04257dc6e9f603d2febe8ab622f755787ef85
        ];
        
        // Initialize isAlive and roleCommits array
        for (uint i = 0; i < game.players.length; i++) {
            game.isAlive[game.players[i]] = true;
            game.roleCommits[game.players[i]] = commits[i];
        }
        
        // Init other variables
        game.numAlive = game.players.length;
        game.nightTime = true;
    }

    function playCouchsurfer(bytes memory _proof) public {
        // IMPORTANT NOTE: on-chain verification in Noir is broken, so we are skipping this step for now.
        // verify the validity of the proof
        //require(proveRoleVerifier.verify(_proof), "Invalid proof in playMafia!");

        // verify that they are a couchsurfer
        // NOTE: here, we would get the data from _proof, but because it is broken,
        // we have to assume for now that only the couchsurfer will call this function

        // extract the commitment to the lucky player
        
    }

    function playMafia(bytes memory _proof, address victimAddress) public {
        // IMPORTANT NOTE: on-chain verification in Noir is broken, so we are skipping this step for now.
        // verify the validity of the proof
        //require(proveRoleVerifier.verify(_proof), "Invalid proof in playMafia!");

        // verify that they are a mafia
        // NOTE: here, we would get the data from _proof, but because it is broken,
        // we have to assume for now that only the mafia will call this function

        // you are not allowed to kill someone who is not playing/already dead.
        require(game.isAlive[victimAddress] == true);

        // you can only kill at night
        require(game.nightTime, "can only kill at night");

        // mark the victim as killed
        game.isAlive[victimAddress] = false;

        // the village population is decreasing :(
        game.numAlive -= 1;

        // Change to daytime
        game.nightTime = false;
    }

    function vote(address suspect) public {
        require(game.isAlive[msg.sender], "Dead/unregistered player can't vote"); // require that voter is in game (check roleCommits[] != 0)
        require(game.votes[msg.sender] == address(0), "Can't vote more than once"); // require that voter hasn't voted before (votes[msg.sender) == 0)
        require(game.isAlive[suspect], "Make sure suspect is alive");
        require(!game.nightTime, "Can only vote to kill during the day");
        
        game.votes[msg.sender] = suspect; // set vote
        game.voteTallies[suspect]++; // tally vote
        game.numVotesReceived += 1;  // inc votesRecvd

        // if everyone has voted, then decide who will be killed
        if (game.numVotesReceived == game.numAlive) {
            executeVote(); 
        }
    }

    function executeVote() public {

        bool tie = false;
        address mostVotesAddr = address(0);
        for (uint i = 0; i < game.players.length; i++) {
            if (game.voteTallies[game.players[i]] > game.voteTallies[mostVotesAddr]) {
                mostVotesAddr = game.players[i];
                tie = false;
            }
            else if (game.voteTallies[game.players[i]] == game.voteTallies[mostVotesAddr]) {
                tie = true;
            }
        }

        // kill loser, tie => no one dies
        if (!tie) {
            game.isAlive[mostVotesAddr] = false;
            game.numAlive--;
        }

        // change round, phase, numVotes received, 
        game.round += 1;
        game.nightTime = true;
        game.numVotesReceived = 0;

        // clear votes
        for (uint i = 0; i < game.players.length; i++) {
            game.voteTallies[game.players[i]] = 0;
            game.votes[game.players[i]] = address(0);
        }
    }

    function areTheyAlive(address friend) public view returns (bool status) {
        return game.isAlive[friend];
    }

    function announceRole() public {

    }
}
