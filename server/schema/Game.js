const mongoose = require('mongoose');
const crypto = require('crypto');

const PlayerSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    pseudo: {
        type: String,
        required: true
    },
    socketId: {
        type: String,
        // required: true
    },
    score: {
        type: Number,
        default: 0
    }
}, { _id: false });



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
    startedAt: {
        type: Date
    },
    endedAt: {
        type: Date
    },
    sharingCode : {
        type: String
    },
    presentator: {
        // userId: {
        //     type: Number,
        //     // required: true
        // }, //NOT NEEDED ????????
        socketId: {
            type: String,
            // required: true
        }
    },
    players: [PlayerSchema],
    currentRound: {
        type: Number,
        default: 0
    },
    totalRounds: {
        type: Number,
        default: 10,
        // required: true
    },
    // playlist: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Playlist',
    //     required: true
    // },
    // currentSong: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Song'
    // },
    // settings: {
    //     maxPlayers: {
    //         type: Number,
    //         default: 10
    //     },
    //     roundDuration: {
    //         type: Number,
    //         default: 30 // seconds
    //     }
    // }
});


// method to generate a sharing code
GameSchema.methods.generateSharingCode = function () {
    const roomId = this.roomId;

    // generate 4 randoms characters
    const randomPart = crypto.randomBytes(2).toString('hex');
    this.sharingCode = (roomId + randomPart).toUpperCase();
    return this.sharingCode; 
}

module.exports = mongoose.model('Game', GameSchema);