# zkMafia!

Play a game of Mafia without a trusted third party! 

## Introduction
In the standard Mafia game, all players need to trust the moderator. The moderator knows about everything that is going on in the game. Obviously, this is never a problem for friendly games, but wouldn't it be cool to play this game in an actually competitive setting? zkMafia makes this possible. Using zero-knowledge proofs, zkMafia lets the players decentralize the role of the moderator, thus making it possible for players to keep their secrets to themselves while playing the game.

## Gameplay
There are numerous details on how the game is played. The first challenge is to distribute the roles:

## Distributing the roles
First, let's list the roles:
* **Villages**: A regular townsperson. They don't have any special powers.
* **Mafia**: They kill someone each night and try to avoid being found out during the day.
* **Couchsurfer**: Every day, picks someone to spend the night with. If the mafia picks them, they don't die because they weren't home. If the person they are visiting is picked, the couchsurfer dies with the victim.
* **Angel**: Picks someone to save each day. If the mafia picks the same person, the victim is saved.
* **Detective**: Every day, learns someone's role.

If there was a trusted third party, then they could simply shuffle a deck of `n` role cards and distribute them among the `n` players. For zkMafia, we need mental poker-like protocols that allow the parties to do a shuffling without any party learning about the card of any other party. This requires MPC, and is too long of a task to implement during a hackathon.

Instead, we assume that the roles were distributed already, and we only ask the parties to make a hash commitment to their roles. The game starts when every player has submitted their commitment.

## At night
First, the couchsurfer submits a commitment to the person they want to spend the night with. That person should not be publicly announced because the mafia can easily get a double kill.

Then, the angel submits a commitment to the person they want to save.

Then, the detective executes an MPC protocol with the player they want to probe. The output of the MPC protocol reveals to the detective what the role of that person is.

Finally, the mafia collectively decide who they want to kill. We can safely assume that the mafia have a separate channel where they can communicate without being listened to. The name of the victim is publicly announced.

The angel submits a zero-knowledge proof on whether the victim was the person they had decided to save. The couchsurfer submits a zero-knowledge proof on whether the victim was the person they had decided to spend the night with.

## During the day
The townspeople talk publicly and try to decide who the mafia is. As people make their decisions, they submit their vote to the smart contract, which are also public, just like in the real game. After the vote finishes, the smart contract calculates the outcome and kills the person who received the most votes.




 ![Screenshot]("Screen Shot 2023-04-16 at 8.51.54 AM.png")
