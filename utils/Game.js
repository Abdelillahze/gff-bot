"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Game {
  constructor(id, players, settings, rounds) {
    this.id = id;
    this.players = players;
    this.settings = settings;
    this.rounds = rounds;
    this.finished = false;
    this.roundIndex = 0;
    this.roundsLength = rounds.length;
    this.playersLength = players.length;
  }
  onGuess(id, guess) {
    let earnedPoints;
    const round = this.rounds[this.roundIndex];
    if (guess.toLowerCase() !== round.word.toLowerCase()) return;
    switch (round.winners) {
      case 0: {
        earnedPoints = 15;
        break;
      }
      case 1: {
        earnedPoints = 10;
        break;
      }
      default: {
        earnedPoints = 5;
        break;
      }
    }
    round.winners++;
    this.players = this.players.map((player) => {
      if (player.id === id) {
        console.log(`${player.name} earned +${earnedPoints}pts`);
        return Object.assign(Object.assign({}, player), {
          points: player.points + earnedPoints,
        });
      } else {
        return player;
      }
    });
    if (round.winners === this.playersLength) {
      return this.endRound();
    }
  }
  endRound() {
    console.log("round ended");
    if (this.roundIndex + 1 === this.roundsLength) {
      console.log("game finished");
      return true;
    }
    this.roundIndex++;
    return false;
  }
  analize() {
    const sortedPlayers = this.players.sort((a, b) => {
      if (a.points < b.points) {
        return 1;
      } else if (a.points > b.points) {
        return -1;
      } else {
        return 0;
      }
    });

    return sortedPlayers;
  }
}
module.exports = Game;
