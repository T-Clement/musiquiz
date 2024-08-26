const pool = require('../db');


class Game {

    static tableName = "mqz_games";

    constructor(id, score, date_score, id_user, id_room) {
        this.id = id;
        this.score = score;
        this.date_score = date_score;
        this.id_user = id_user,
        this.id_room = id_room;
    }


    getId() {
        return this.id;
    }

    getRoomId() {
        return this.id_room;
    }


    getUserId() {
        return this.id_user;
    }

}

module.exports = Game;