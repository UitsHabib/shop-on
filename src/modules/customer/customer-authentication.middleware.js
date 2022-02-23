const passport = require("passport");

const AuthStrategy = (req, res, next) => { 
    const auth = passport.authenticate("customer-jwt", async function (err, customer) {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal server error.");
        }

        if (!customer) return res.status(401).send("Unauthenticated customer.");

        req.logIn(customer, { session: false }, function (error) {
            if (error) return next(error);
            next();
        });
    });

    auth(req, res, next);
}

module.exports.AuthStrategy = AuthStrategy;