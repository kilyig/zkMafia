# zkMafia!

Play a game of Mafia without a trusted third party! 

## Introduction
In the standard Mafia game, all players need to trust the moderator. The moderator knows about everything that is going on in the game. Obviously, this is never a problem for friendly games, but wouldn't it be cool to play this game in an actually competitive setting? zkMafia makes this possible. Using zero-knowledge proofs, zkMafia lets the players decentralize the role of the moderator, thus making it possible for players to keep their secrets to themselves while playing the game.

## Gameplay
There are numerous details on who 

0. `git submodule update --init --recursive`
1. `forge install`
2. `npm install`
3. `npm run test:full`
4. `npm run deploy`

The frontend repo is a submodule under `ui/`.

---

**Template repository for getting started quickly with Hardhat and Foundry in one project**

![Github Actions](https://github.com/devanonon/hardhat-foundry-template/workflows/test/badge.svg)

### Getting Started

 * Use Foundry: 
```bash
forge install
forge test
```

 * Use Hardhat:
```bash
npm install
npx hardhat test
```

### Features

 * Write / run tests with either Hardhat or Foundry:
```bash
forge test
# or
npx hardhat test
```

 * Use Hardhat's task framework
```bash
npx hardhat example
```

 * Install libraries with Foundry which work with Hardhat.
```bash
forge install rari-capital/solmate # Already in this repo, just an example
```

### Notes

Whenever you install new libraries using Foundry, make sure to update your `remappings.txt` file by running `forge remappings > remappings.txt`. This is required because we use `hardhat-preprocessor` and the `remappings.txt` file to allow Hardhat to resolve libraries you install with Foundry.
