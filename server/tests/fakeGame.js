const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');

/**
 * create a choice and the OjectId related to it
 * @param {string} artistName
 * @param {string} title
 * @returns {object}
 */
function createChoice(artistName, title) {
    return {
        choiceId: new mongoose.Types.ObjectId(),
        artistName,
        title,
    };
}

function createRound(audioPreviewUrl, choicesData, correctIndex = null) {
    // generate choices
    const choices = choicesData.map(data => createChoice(data.artistName, data.title));
    
    // choose randomly the correct answer if no index is setted in params
    const randomIndex =  (correctIndex != null ) ? correctIndex : Math.floor(Math.random() * choices.length);
    const correctAnswer = choices[randomIndex].choiceId;
    
    return {
      roundId: new mongoose.Types.ObjectId(),
      audioPreviewUrl,
      choices,
      correctAnswer,
      correctChoiceAnswer: randomIndex, // only for debug / test purposes
      playersResponses: [],
      playersReady: [],
    };
  }

// fixture : test with dataset with the real context of the app
function createGameFixture(roundsNumber) {

    const rounds = [];
    for (let i = 0; i < roundsNumber; i++) {
        rounds.push(
            createRound(
                `https://example.com/audio-round-${i}.mp3`,
                [
                    { artistName: faker.music.artist() , title: faker.music.songName() },
                    { artistName: faker.music.artist() , title: faker.music.songName() },
                    { artistName: faker.music.artist() , title: faker.music.songName() },
                    { artistName: faker.music.artist() , title: faker.music.songName() },
                ],
                i % 4 // correctAnswer is the index of the round
            )
        );
    }



    return {
        _id: new mongoose.Types.ObjectId(),
        roomId: 1,
        status: "waiting",
        playlistId: "000001",
        roomName: "Testing Playlist",
        roomDescription: "The room used for the test cases",
        roundDuration: 20,
        currentRound: 0,
        totalRounds: roundsNumber, // see if realy needed to be accurate
        rounds: rounds,
        players: [
            { userId: 1, pseudo: "TestingUser", socketId: "socket123456", score: 0 },
        ],
        sharingCode: "11111"
    }
}

module.exports = { createGameFixture };


