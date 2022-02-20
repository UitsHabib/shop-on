const passport = require("passport");
const { Strategy } = require("passport-jwt");
const Shop = require("./shop.model");


module.exports = function () {
    function cookieExtractor(req) {
        let token = null;
        if (req && req.signedCookies) token = req.signedCookies["access_token"];
        return token;
    }

    passport.use(
        "shop-jwt",
        new Strategy(
            { secretOrKey: process.env.TOKEN_SECRET, jwtFromRequest: cookieExtractor },
            function (payload, done) {
                Shop.findOne({
                    where: {
                        id: payload.id,
                    },
                }).then((shop) => {
                    if (shop) return done(null, shop);
                    return done(null, false);
                });
            }
        )
    );
};
