const passport = require("passport");
const { Strategy } = require("passport-jwt");
const Customer = require("./customer.model");

module.exports = function () {
  function cookieExtractor(req) {
    let token = null;
    if (req && req.signedCookies) token = req.signedCookies["access_token"];
    return token;
  }

  passport.use(
    "customer-jwt",
    new Strategy(
      { secretOrKey: process.env.TOKEN_SECRET, jwtFromRequest: cookieExtractor },
      function (payload, done) {
        Customer.findOne({
          where: {
            id: payload.id,
          },
        }).then((customer) => {
          if (customer) return done(null, customer);
          return done(null, false);
        });
      }
    )
  );
};
