const jwt = require("jsonwebtoken");

exports.authenticateJWT = async (req, res, next) => {
    console.log('in authenticate middleware');
    console.log('log of list of cookies');
    console.log(req.cookies);
    const token = req.cookies.accessToken;
    
    if (!token) {
        // Si pas de token, essayer de renouveler avec le refresh token
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Non authentifié' });
        }
        
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (err, user) => { // user in payload of token
            if (err) {
                return res.status(403).json({ message: 'Refresh token invalide ou expiré' });
            }
            
            const utils = require('../utils/utils');
            // Générer un nouveau access token
            const newAccessToken = utils.generateAccessToken({ userId: user.userId, pseudo: user.pseudo }, process.env.JWT_SECRET_KEY, '15m');
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 15 * 60 * 1000  // 15 minutes
            });

            req.user = { userId: user.userId, pseudo: user.pseudo };
            next();
            // Envoyer les infos utilisateur
            // return res.status(200).json({ user: { userId: user.userId, pseudo: user.pseudo } });
        });
    } else {
        // Si l'access token est valide
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Token expiré ou invalide' });
            }

            req.user = { userId: user.userId, pseudo: user.pseudo };
            next();
        });
    }
};



// exports.refreshToken = (req, res) => {
//     const refreshToken = req.cookies.refreshToken;

//     if (!refreshToken) {
//         return res.status(401).json({ message: 'Non authentifié' });
//     }

//     // Vérifier le refresh token
//     jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (err, user) => {
//         if (err) {
//             return res.status(403).json({ message: 'Refresh token invalide ou expiré' });
//         }

//         // Générer un nouveau access token
//         const newAccessToken = jwt.sign(
//             { userId: user.userId, pseudo: user.pseudo, email: user.email }, 
//             process.env.JWT_SECRET_KEY, 
//             { expiresIn: '15m' }
//         );

//         // Stocker le nouveau JWT dans un cookie httpOnly
//         res.cookie('jwtToken', newAccessToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'Strict',
//             maxAge: 15 * 60 * 1000  // 15 minutes en ms
//         });

//         res.status(200).json({ message: "Token renouvelé" });
//     });
// };
