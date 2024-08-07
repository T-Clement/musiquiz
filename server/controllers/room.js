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


        // get pseudo of each player for each Game
        // await foreach call to database made to be resolved
        const scoresWithUsernames = await Promise.all(scores.map(async (score) => {
            const user = await User.findOneUserById(score.id_user);
            score.pseudo_user = user.getPseudo();
            return score;
        }));

        room.scores = scoresWithUsernames;

        // return room data
        res.status(200).json({room});

    } catch (error) {
        res.status(500).json({ message: "Servor Error" });
        next(error);
    }


}