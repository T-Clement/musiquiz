// Store: where all the application states are stored

class InMemoryStore {
  #games = new Map(); // gameId as key
  #players = new Map();

  // -------- GAMES -----------
  getGame(id) {
    return this.#games.get(id);
  }

  saveGame(id, game) {
    return this.#games.set(id, game);
  }

  deleteGame(id) {
    return this.#games.delete(id);
  }

  // -------- PLAYERS -----------
  addPlayer(uid, gid) {
    this.#players.set(uid, gid);
  }
  removePlayer(uid) {
    this.#players.delete(uid);
  }
  playerGame(uid) {
    return this.#players.get(uid);
  }

  removePlayersFromInGameState(gameId) {
    // remove from store all users who are in this game who as ended
    for(let [key, value] of this.#players.entries()) { // get all players in a game
      if(value === gameId) { // delete of player is in the game who as ended
          console.log(`user ${key} deleted from game ${value}`)
          this.#players.delete(key); // key is the userId
      }
    }
  }






  // ---------- TO USE FOR REFACTO -------
  // to give access to Maps in this store
  get games()  {
    return this.#games;
  }

  get playersInGames() {
    return this.#players;
  }

}

module.exports = InMemoryStore;
