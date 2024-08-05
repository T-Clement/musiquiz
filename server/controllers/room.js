const Room = require('../models/Room');

const { validationResult, matchedData } = require("express-validator");


exports.show = async (req, res, next) => {
    const roomId = parseInt(req.params.id);

    if(!roomId) {
        return next(new Error("Param missing in Room get request"));
    }

    try {
        const room = await Room.findOneRoomById(roomId);

        if(!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.status(200).json(room);

    } catch (error) {
        res.status(500).json({ message: "Servor Error" });
        next(error);
    }


}