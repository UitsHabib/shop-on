const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
    return jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
        expiresIn: "1h", 
        issuer: user.id.toString()
    });
}

module.exports.generateAccessToken = generateAccessToken;
