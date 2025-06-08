const Room = require('../models/Room');
const Theme = require('../models/Theme');
const User = require('../models/User');

const { validationResult, matchedData } = require("express-validator");


exports.show = async (req, res, next) => {
    const roomId = parseInt(req.params.id);

    if(!roomId) {
        return next(new Error("Param missing in Room get request"));
    }

    try {

        // get room data and games played in this room
        const [room, scores] = await Promise.all([
            Room.findOneRoomById(roomId),
            Room.getRoomScores(roomId, 10, 0),
        ]);

        if(!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // get theme name
        const theme = await Theme.findOneThemeById(room.id_theme);
        room.name_theme = theme.name;

        //get all ids of users who are in scores
        const userIds = scores.map(score => score.id_user);

        // get all users with these ids
        const players = await User.findManyUsersByIds(userIds);
        // get pseudo of each player for each Game
        const scoresWithUsernames = scores.map(score => {
            const player = players.find(p => p.id === score.id_user);
            return {
                ...score,
                pseudo_user: player ? player.getPseudo() : "Unknown Player"
            };
        });

        room.scores = scoresWithUsernames;

        // !! TODO : FIND A WAY TO UPDATE CACHE -> no data related to player because cache is used by all players !!
        // !! cache is set with call of .json method, so it's not possible to put data related to player
        // TODO : get the number of games played in this room 


        // TODO : get the best position of currently connected user in this room


        // rooms with the same theme
        room.theme = {};
        room.theme.id_theme = room.id_theme;
        room.theme.name = theme.name;
        const relatedRooms = await Theme.getRoomsOfOneTheme(room.id_theme);

        // remove current room from related rooms
        const filteredRooms = relatedRooms.filter(r => r.room_id !== roomId);

        room.theme.relatedRooms = filteredRooms;


        // console.log("Room data: ", room);
        // return room data
        res.status(200).json({room});

    } catch (error) {
        res.status(500).json({ message: "Servor Error" });
        next(error);
    }


}



exports.store = async (req, res) => {

    try {

        
            // data who passed the validator
            const validatedData = matchedData(req);
        
            const {title, playlist_id, description, theme_id} = validatedData;
        
        
            console.log(title, playlist_id, description, theme_id);
        
            // check title, playlist_id and theme_id
            const existingRoomByTitle = await Room.findOneRoomByTitle(title);
            if(existingRoomByTitle) {
                return res.status(400).json({
                    error: "title_exists",
                    message: "Une room avec ce titre existe déjà",
                    room: existingRoomByTitle
                });
            }
        
        
            const existingRoomByPlaylistId = await Room.findOneRoomByPlaylistId(playlist_id);
            if(existingRoomByPlaylistId) {
                return res.status(400).json({
                    error: "playlist_id_exists",
                    message: "Une room avec cet identifiant de playlist existe déjà",
                    room: existingRoomByPlaylistId
                });
            }
        
        
            const existingTheme = await Theme.findOneThemeById(theme_id);
            if(!existingTheme) {
                return res.status(404).json({
                    error: "theme_id_not_exists",
                    message: `Aucun thème n'existe avec l'identifiant ${theme_id}`
                });
            }
        
            // create new room
                // to update to associate with a user by its id
            const newRoom = await Room.insertNewRoom(title, playlist_id, description, theme_id);

            return res.status(201).json({
                message: "Room crée avec succès",
                room: newRoom
            });


    } catch (error) {

        console.error("Error in room.store", error);
        return res.status(500).json({
            message: "Une erreur est survenue lors de la création de la room."
        });
    }        

}