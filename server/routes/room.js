const express = require('express');
const router = express.Router();

const roomCtrl = require("../controllers/room");

const GameManager = require('../services/GameManager');
const Theme = require('../models/Theme');
const InputValidationMessage = require('../models/InputValidationMessage');
const Room = require('../models/Room');
const { body, matchedData } = require("express-validator");
const validateRequest = require('../middleware/validateRequest');
const cache = require('../middleware/cache');


const validateRegisterUserTheme = [

];


const validateCheckNewPlaylist = [
    body("playlist_id").exists().notEmpty()
];


const validateNewStoredRoom = [
    body("title")
        .exists()
        .trim()
        .escape()
        .notEmpty().withMessage(InputValidationMessage.MISSING_TITLE)
        .isString().withMessage("Le titre doit être une chaine de caractères")
        .isLength({min: Room.ROOM_TITLE_MIN_LENGTH, max: Room.ROOM_TITLE_MAX_LENGTH})
            .withMessage(InputValidationMessage.TITLE_LENGTH_ERROR)
    ,
    body("playlist_id")
        .exists()
        .trim()
        .escape()
        .notEmpty(),
        // custom validation 
        // check if room is not already registered -> returns the room if true

    body("description")
        .exists()
        .trim()
        .escape()
        .isLength({max: Room.ROOM_DESCRIPTION_MAX_LENGTH})
            .withMessage(InputValidationMessage.DESCRIPTION_LENGTH_ERROR),
        body("theme_id")
        .exists()
        .trim()
        .escape()
        .isString()
        // check if theme passed is in the stored themes
];
    
    
router.get('/random', async (req, res, next) => {

    const randomRooms = await Room.getRandomRooms(5);

    if(!randomRooms) {
        return res.status(500).json({message: "Random room fetching as failed"})
    }

    return res.status(200).json({rooms : randomRooms});



});

router.get('/:id', cache(req => `musiquiz.room.show[id-${parseInt(req.params.id)}]`) , roomCtrl.show);

router.post("/check-new-playlist", validateCheckNewPlaylist, validateRequest, async (req, res, next) => {

    const validatedData = matchedData(req);

    const { playlist_id } = validatedData;

    // console.log(playlist_id);
    const deezerBaseApiUrl = "https://api.deezer.com/playlist";

    // fetch deezer API
    const fetchedPlaylist = await fetch(`${deezerBaseApiUrl}/${playlist_id}`);

    if(!fetchedPlaylist) {
        const errorBody = await fetchedPlaylist.text();
        return res.status(404).json({message: "Aucune playlist publique trouvée avec cet identifiant"});
    }

    const apiMusicData = await fetchedPlaylist.json();


    if (!apiMusicData || !apiMusicData.tracks) {
        throw new Error('Impossible de récupérer les données de la playlist depuis l\'API');
    }


    const listOfTracks = apiMusicData.tracks.data;

    // check if list of tracks have the correct length
    // on the filtered list of tracks, wich is compose with the track rejected and the reason related 
    const numberOfRounds = GameManager.roundsNumber;
    const numberOfResponsePropositions = GameManager.numberOfResponsePropositions;

    const noExtractsTracks = [];
    const notReadablesTracks = [];

    const filteredTracks = [];
    
    listOfTracks.forEach(track => {
        if(!track.readable) {
            notReadablesTracks.push(track);
        } else if (!track.preview || track.preview === "") {
            noExtractsTracks.push(track);
        } else {
            filteredTracks.push({
                artist: track.artist.name, 
                title: track.title,
            });
        }
    });
    
    const lengthCondition = filteredTracks.length >= numberOfResponsePropositions * numberOfRounds;

    if(!lengthCondition && (noExtractsTracks.length > 0 || notReadablesTracks.length > 0)) {
        return res.status(400).json({
            state: false,
            data: {
                notReadablesTracks: notReadablesTracks,
                noExtractsTracks: noExtractsTracks,
                tracksAvailables: filteredTracks.length,
                message: "La playlist ne remplit pas toutes les conditions."
            }
        });
    }

    return res.status(200).json({ 
        state: true,
        data: {
            tracksAvailables : filteredTracks,
            notReadablesTracks: notReadablesTracks,
            noExtractsTracks: noExtractsTracks,
            themes: await Theme.getThemes() 
        },
        message: "La playlist remplit toutes les conditions, elle peut devenir une room."
    });

});


// validation of entry data for stored room
// check if user is connected -> auth middleware
// associate user to the new stored room



router.post("/store", validateNewStoredRoom, validateRequest, roomCtrl.store);


module.exports = router;
