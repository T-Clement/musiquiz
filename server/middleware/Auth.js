const jwt = require("jsonwebtoken");

const { generateAccessToken } = require("../utils/utils");

async function handleRefreshToken(req, res, next) {
  console.log("Handling refresh token...");
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Non authentifié" });
  }
  // verify refresh token
  try {
    const payload = await verifyJwt(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);

    const newAccessToken = generateAccessToken(
      { userId: payload.userId, pseudo: payload.pseudo },
      process.env.JWT_SECRET_KEY,
      "15m"
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          maxAge: 15 * 60 * 1000, // 15 minutes validation
    });

    // add user data to request
    req.user = { userId: payload.userId, pseudo: payload.pseudo };
    
    next();
  } catch (err) { // for any error occured
    return res.status(401).json({ message: "Refresh token invalide ou expiré" });
  }
}
 
/**
 * This function verifies a JWT token using the provided secret key.
 * It returns a promise that resolves with the payload if the token is valid,
 * @param {*} token 
 * @param {*} secret 
 * @returns 
 */
function verifyJwt(token, secret) {
  // return a promise that resolves with the payload or rejects with an error
  return new Promise((resolve, reject) => {
    // verify the token with the secret key
    jwt.verify(token, secret, (err, payload) => {
      if (err) {
        return reject(err);
      }
      resolve(payload);
    });
  })
}

/**
 * Middleware to authenticate JWT token
 * 
 * Check if accessToken is in cookies of request
 * If not or expired, try to refresh it with refreshToken
 * Add user data to request (req.user)
 * Return 401 if error
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {Function} next 
 * @returns 
 */
exports.authenticateJWT = async (req, res, next) => {
  try {
    
    const token = req.cookies.accessToken;
    console.log("accessToken in  authenticateJWT middleware", token);
    // no access token, try to refresh it
    if(!token) return await handleRefreshToken(req, res, next);

    // access token is present, verify it
    const payload = await verifyJwt(token, process.env.JWT_SECRET_KEY);
    
    // add user data to request
    req.user = { userId: payload.userId, pseudo: payload.pseudo };
    
    // continue to next middleware
    next();

  } catch (err) {
    // if any error occured, send 401
    console.log("error in ")
    console.error(err);
    return res.sendStatus(401);
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
      console.error(err);
    } else {
      // token is verified and add user to request
      req.user = { userId: payload.userId, pseudo: payload.pseudo };
    }
    return next();
  });
};

