const Game = require("../../schema/Game");

class GameRepository {

   // used in  _endRound, _endGame, submitAnswer



    async saveRoundResults(gameId, roundIndex, responses, players) {

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