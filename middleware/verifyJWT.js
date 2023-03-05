const jwt = require("jsonwebtoken");
const { tokenSecret } = require("../config/app");

const varifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(" ")[1];
    jwt.verify(token, tokenSecret, (err, decoded) => {
        if (err) return res.sendStatus(403); //Invalid Token
        req.user = decoded.user.username;
        req.roles = decoded.user.roles;
        next();
    });
};
module.exports = varifyJWT
