
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


exports.generateAccessToken = (user, SECRET_KEY, TOKEN_EXPIRATION) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign(
        { userId: user.id, pseudo: user.pseudo }, 
        SECRET_KEY, 
        { expiresIn: TOKEN_EXPIRATION }
    );
  
}


exports.generateRefreshToken = (user, REFRESH_SECRET, REFRESH_EXPIRATION) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign(
        { userId: user.id, pseudo: user.pseudo }, 
        REFRESH_SECRET, 
        { expiresIn: REFRESH_EXPIRATION }
    );
}

// check if there is enough tracks to play game with the settings setted
exports.checkIfTracksAreReadable = (listOfTracks) => {
    return listOfTracks.filter(track => track.readable && track.preview && track.preview != '');
}


exports.shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
}


exports.generatePresentatorToken = (gameId) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign(
        { gameId, role: 'presentator' },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '24h', noTimestamp: true } // no timeStamp to generate same token at any time
    );
}

exports.verifyPresentatorToken = (gameId, token) => {
    const jwt = require('jsonwebtoken');
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return payload.role === 'presentator' && payload.gameId === gameId;
    
}