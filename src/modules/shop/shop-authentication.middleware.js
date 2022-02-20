const jwt = require('jsonwebtoken');
const passport = require('passport');

const AuthStrategy = (req, res, next) => {
    const auth = passport.authenticate("shop-jwt", async function (err, shop) {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal server error.");
        }

        if (!shop) return res.status(401).send("Unauthenticated shop.");

        req.logIn(shop, { session: false }, function (error) {
            if (error) return next(error);
            next();
        });
    });
    
    auth(req, res, next);
}

module.exports.AuthStrategy = AuthStrategy;
