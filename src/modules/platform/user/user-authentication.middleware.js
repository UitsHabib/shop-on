const jwt = require("jsonwebtoken");
const passport = require("passport");

const AuthStrategy = (req, res, next) => { 
    const auth = passport.authenticate("user-jwt", async function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal server error.");
        }
        if (!user) return res.status(401).send("Unauthenticated user.");

        req.logIn(user, { session: false }, function (error) {
            if (error) return next(error);
            // req.user = user.dataValues;
            next();
        });
    });
    auth(req, res, next);
}


module.exports.AuthStrategy = AuthStrategy;












const verifyToken = async (req, res, next) => {
    const token = req.headers["access-token"];

    if (!token) return res.status(403).json("Authentication failed!");

    try {
        const decoded = jwt.verify(token, "mysecret");
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json("Invalid Token!");
    }
};

// module.exports = verifyToken;
