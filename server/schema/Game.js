const mongoose = require('mongoose');


const GameSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    roomId: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['waiting', 'in_progress', 'finished'],
        default: 'waiting'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    presentator : {
        type: String,
        default: {
            userId: null, // really needed if only socketId is user ??????
            socketId: String
        }
    },
    players: {
        type: Array,
        default: []
    }

})


module.exports = mongoose.model('Game', GameSchema);