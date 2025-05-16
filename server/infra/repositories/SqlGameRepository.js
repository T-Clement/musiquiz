const GameSQL = require('../../models/Game');


// Gateway equivalent
class SqlGameRepository {
    async registerEndedGame(room_id, players) {

        await Promise.all(
            players.map(player => {
                GameSQL.insertNewEndedGame(
                    parseInt(player.userId), 
                    parseInt(player.score), 
                    parseInt(room_id)
                );
            })
        );
    }


}

module.exports = SqlGameRepository;