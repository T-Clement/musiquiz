const Game = require("../../schema/Game");

class GameRepository {

   // used in  _endRound, _endGame, submitAnswer



    async savePlayerResponse(gameId, roundIndex, userId, responseTime, choiceId, scoreRound) {
        return await Game.findOneAndUpdate(
            {_id: gameId},
            {
                $push: { [`rounds.${roundIndex}.playersResponses`] : { // rounds.${roundIndex} to get access to a sub-array
                    userId,
                    userChoice: choiceId,
                    responseTime,
                    score: scoreRound
                }
            }
            },
            { new: true } // returns new version of Document
        );
    }

    async saveRoundResults(gameId, roundIndex, roundPlayersResponses, playersScores) {
        return await Game.findOneAndUpdate(
            {_id: gameId},
            {
                $set: {
                    [`rounds.${roundIndex}.playersResponses`]: roundPlayersResponses,
                    players: playersScores,                             
                  },
            }
            
        )
    }


    async finishGame(gameId) {
        return await Game.findOneAndUpdate(
            { _id: gameId }, 
            { $set: {
                status: "finished",
                endedAt: new Date()
            }},
            {new: true} // tells to Mongoose to returns new updated object
        );
    }

}

module.exports = GameRepository;