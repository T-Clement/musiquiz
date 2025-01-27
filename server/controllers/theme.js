const Theme = require('../models/Theme');

const { validationResult, matchedData } = require("express-validator");



exports.show = async (req, res, next) => {
    // get theme id placed as param in GET request
    const themeId = parseInt(req.params.id);

    if(!themeId) {
        return next(new Error("Param missing in Theme get request"));
        
    }

    try {
        const theme = await Theme.findOneThemeById(themeId);

        if(!theme) {
            return res.status(404).json({ message: "Theme not found" });
        }

        // NEED TO FETCH DATA COMMING FROM ROOM METHOD
        // const Room = require('../models/Room');
        // const [room, scores] = await Promise.all([
        //     Room.
        // ])
        // add rooms to theme object
        theme.rooms = await Theme.getRoomsOfOneTheme(themeId);


        res.status(200).json(theme);

    } catch(error) {
        res.status(500).json({ message : "Servor Error" });
        next(error);
    }

}
// const Room = require("./models/Room");
// const Game = require("./models/Game");
// const User = require('./models/User');

// // big query who gets the 3 must played rooms and the current bestscore Game of each of this rooms
// const query = `
//     SELECT g.id AS game_id, g.date_score, r.id AS room_id, u.id AS user_id, u.pseudo, g.score as current_bestscore, gp.games_played
//     FROM ${Game.tableName} g
//     JOIN ${User.tableName} u ON g.id_user = u.id
//     JOIN ${Room.tableName} r ON g.id_room = r.id
//     JOIN (
//         SELECT id_room, COUNT(id) as games_played
//         FROM ${Game.tableName}
//         GROUP BY id_room
//     ) gp ON r.id = gp.id_room
//     WHERE g.score = (
//         SELECT MAX(score)
//         FROM ${Game.tableName}
//         WHERE id_room = r.id
//     )
//     GROUP BY r.id, u.id, u.pseudo, g.id, g.date_score, g.score, gp.games_played
//     HAVING id_theme = ?;
// `;

// try {
//     const [rows, fields] = await pool.execute(query, []);

//     const top3 = await Promise.all(rows.map(async (row) => {
//         let room = null;

//         let game = new Game(row.game_id, row.current_bestscore, null, row.user_id, row.room_id);

//         // name of room
//         room = await Room.findOneRoomById(game.getRoomId());
//         room.name = room.getName();
        
//         // user name of game
//         let user = await User.findOneUserById(game.getUserId());
//         game.pseudo_user = user.getPseudo();

//         // add game data to room object
//         room.game = game;

//         return room;
//     }));


//     res.status(200).json(top3);

// } catch (error) {
//     console.error('Error getting room games: ' + error.message);
//     next(error); 
// }

exports.index = async (req, res, next) => {
    try {
        const themes = await Theme.getThemes();

        if(!themes) {
            return res.status(404).json({ message: "Themes not found" });
        }


        res.status(200).json(themes);
    } catch(error) {
        res.status(500).json({ message: "Servor Error" });
        next(error);
    } 
}