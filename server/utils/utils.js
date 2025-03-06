
exports.generatePasswordHash = async (password, saltRounds) => {
    const bcrypt = require('bcrypt');
    
    
    try {
        
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        
        return hash;
        
    } catch (err) {
        console.error('Error generating password hash:', err);
        throw err;
    }
    
};


exports.generateAccessToken = async (user, SECRET_KEY, TOKEN_EXPIRATION) => {
    const jwt = require('jsonwebtoken');
    try {
        return jwt.sign({ userId: user.id, userPseudo: user.pseudo }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });

    } catch(error) {
        console.log(error);
        
    }
}


exports.generateRefreshToken = async (user, REFRESH_SECRET, REFRESH_EXPIRATION) => {
    const jwt = require('jsonwebtoken');
    try {
        
        return jwt.sign({ userId: user.id, userPseudo: user.pseudo }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRATION });
    } catch (error) {
        console.log(error);
        
    }
}

// check if there is enough tracks to play game with the settings setted
exports.checkIfTracksAreReadable = (listOfTracks) => {
    return listOfTracks.filter(track => track.readable && track.preview && track.preview != '');
}


exports.shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
}
