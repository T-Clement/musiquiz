const express = require('express');
const router = express.Router();

const roomCtrl = require("../controllers/room");

const { body } = require("express-validator");
const GameManager = require('../services/GameManager');
const Theme = require('../models/Theme');


const validateRegisterUserTheme = [

];

router.get('/:id', roomCtrl.show);

router.post("/check-new-playlist", async (req, res, next) => {

    const { playlist_id } = req.body;

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




module.exports = router;
