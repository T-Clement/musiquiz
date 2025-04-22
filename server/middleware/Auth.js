const jwt = require("jsonwebtoken");

exports.authenticateJWT = async (req, res, next) => {
  console.log("in authenticate middleware");
  console.log("log of list of cookies");
  console.log(req.cookies);
  const token = req.cookies.accessToken;
  console.log(token);
  if (!token) {
    console.log("Dans le if !token");
    // si pas de token, essayer de renouveler avec le refresh token
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    // is it working here ???
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY,
      (err, user) => {
        // user in payload of token
        if (err) {
          return res
            .status(403)
            .json({ message: "Refresh token invalide ou expiré" });
        }

        const utils = require("../utils/utils");
        // generate a new accessToken
        const newAccessToken = utils.generateAccessToken(
          { userId: user.userId, pseudo: user.pseudo },
          process.env.JWT_SECRET_KEY,
          "15m"
        );
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          maxAge: 15 * 60 * 1000, // 15 minutes validation
        });

        req.user = { userId: user.userId, pseudo: user.pseudo };
        next();
        // envoyer les infos utilisateur
        // return res.status(200).json({ user: { userId: user.userId, pseudo: user.pseudo } });
      }
    );
  } else {
    // if accessToken is valid
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token expiré ou invalide" });
      }
      console.log(
        "dans le verify du token présent dans authenticateJWT méthode"
      );
      console.log(user);
      req.user = { userId: user.userId, pseudo: user.pseudo };
      next();
    });
  }
};

exports.optionalAuth = async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    // no token, non auth user
    req.user = null;
    return next();
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      // invalid or expired token -> act as non auth user
      req.user = null;
    } else {
      // token is verified and add user to request
      req.user = { userId: payload.userId, pseudo: payload.pseudo };
    }
    return next();
  });
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
