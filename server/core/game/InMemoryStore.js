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
