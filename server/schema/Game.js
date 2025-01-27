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



const ChoiceSchema = new mongoose.Schema({
    choiceId: mongoose.Types.ObjectId,
    artistName: {type: String},
    title: {type: String},
    
}, {_id: false})

const PlayerResponseSchema = new mongoose.Schema({
    userId: {type: Number},
    userChoice : {type: mongoose.Types.ObjectId},
    responseTime: {type: Number},
    score: {type: Number}

}, {_id: false});


const RoundSchema = new mongoose.Schema({
    roundId: mongoose.Types.ObjectId,
    audioPreviewUrl: {type: String},
    choices: [ChoiceSchema],
    // correctAnswer: {type: String},
    correctAnswer: mongoose.Types.ObjectId,
    playersResponses: [PlayerResponseSchema],
    playersReady: [Number] // array of userId / playerId when they are ready
    
}, {_id: false});




const GameSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    roomId: { // game document related to this roomId
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['waiting', 'in_progress', 'finished', 'failed'],
        default: 'waiting'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    playlistId: {type: String, required: true},
    roomName: {type: String},
    roomDescription: {type: String},
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
        userId: {
        //     type: Number,
        //     // required: true
        }, //NOT NEEDED ????????
        socketId: {
            type: String,
            // required: true
        }
    },
    players: [PlayerSchema],
    roundDuration: {
        type: Number,
        default: 20
    },
    currentRound: {
        type: Number,
        default: 0
    },
    totalRounds: {
        type: Number,
        default: 10,
        // required: true
    },
    gameStartTime: {
        type: Date,
    },
    rounds:  [RoundSchema],
    message: {type: String}
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