const pool = require('../db');

class Room {

    static tableName = "mqz_rooms";

    constructor(id, name, api_id_playlist, description, themeId) {
        this.id = id;
        this.name = name;
        this.api_id_playlist = api_id_playlist;
        this.description = description;
        this.themeId = themeId;
    }







}